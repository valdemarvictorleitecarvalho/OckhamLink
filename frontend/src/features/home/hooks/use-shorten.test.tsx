import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useShorten } from "./use-shorten";
import { apiClient } from "@/shared/api/api-client";
import { API_ENDPOINTS, EXTERNAL_API } from "@shared/@constants";

vi.mock("@/shared/api/api-client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

vi.mock("@shared/@constants", () => ({
  API_ENDPOINTS: { SHORTEN: "/shorten" },
  ENV: { SHORT_DOMAIN: "https://ock.hm/" },
  EXTERNAL_API: {
    QR_CODE_GENERATOR:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=",
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

/**
 * Unit tests for the useShorten custom hook. These tests cover the successful shortening of a URL, formatting of the
 * resulting short URL and QR code URL, and the proper handling of backend errors. The tests ensure that the hook's
 * logic for interacting with the API and processing responses behaves as expected under various conditions, providing
 * confidence in its reliability when used within the DynamicFormPanel component for URL shortening functionality.
 */
describe("useShorten Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully shorten a URL and format the result", async () => {
    const mockResponse = { data: "xpto123" };

    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useShorten(), { wrapper });

    const longUrl = "https://very-long-and-boring-url.com/article/123";

    let data;
    await waitFor(async () => {
      data = await result.current.mutateAsync(longUrl);
    });

    expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.SHORTEN, {
      url: longUrl,
    });

    const expectedFinalUrl = "https://ock.hm/xpto123";

    expect(data).toEqual({
      resultUrl: expectedFinalUrl,
      qrCodeUrl: `${EXTERNAL_API.QR_CODE_GENERATOR}${encodeURIComponent(
        expectedFinalUrl,
      )}`,
    });
  });

  it("should propagate backend errors correctly", async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(
      new Error("Invalid URL format"),
    );

    const { result } = renderHook(() => useShorten(), { wrapper });

    await expect(result.current.mutateAsync("not-a-url")).rejects.toThrow(
      "Invalid URL format",
    );
  });
});
