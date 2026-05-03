import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useResolve } from "./use-resolve";
import { apiClient } from "@shared/api/api-client";
import { API_ENDPOINTS, EXTERNAL_API } from "@shared/@constants";

vi.mock("@shared/api/api-client", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

/**
 * Unit tests for the useResolve custom hook. These tests cover the successful resolution of a short code, extraction of
 * short codes from full URLs, handling of invalid input scenarios, and proper propagation of backend errors. The
 * tests ensure that the hook's logic for interacting with the API and processing responses behaves as expected under
 * various conditions, providing confidence in its reliability when used within the DynamicFormPanel component for URL
 * resolution functionality.
 */
describe("useResolve Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should resolve a raw short code successfully", async () => {
    const mockResponse = {
      data: { originalUrl: "https://verylongurl.com/article/1" },
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useResolve(), { wrapper });

    let data;
    await waitFor(async () => {
      data = await result.current.mutateAsync("abc123");
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      `${API_ENDPOINTS.RESOLVE}/abc123`,
    );

    expect(data).toEqual({
      resultUrl: "https://verylongurl.com/article/1",
      qrCodeUrl: `${EXTERNAL_API.QR_CODE_GENERATOR}${encodeURIComponent(
        "https://verylongurl.com/article/1",
      )}`,
    });
  });

  it("should extract the short code if a full URL is provided", async () => {
    const mockResponse = {
      data: { originalUrl: "https://hidden-truth.com" },
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useResolve(), { wrapper });

    await waitFor(async () => {
      await result.current.mutateAsync("https://ock.hm/xyz789");
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      `${API_ENDPOINTS.RESOLVE}/xyz789`,
    );
  });

  it("should throw an error if the extracted short code is empty", async () => {
    const { result } = renderHook(() => useResolve(), { wrapper });

    await expect(result.current.mutateAsync("   ")).rejects.toThrow(
      "Invalid short code",
    );

    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("should propagate backend errors correctly", async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error("Link not found"));

    const { result } = renderHook(() => useResolve(), { wrapper });

    await expect(result.current.mutateAsync("invalidCode")).rejects.toThrow(
      "Link not found",
    );
  });
});
