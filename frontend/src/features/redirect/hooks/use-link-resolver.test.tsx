import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useLinkResolver } from "./use-link-resolver";
import { ENV, API_ENDPOINTS } from "@shared/@constants";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

/**
 * Test suite for the useLinkResolver custom hook.
 * Verifies that the hook calls the backend with the correct
 * short code and base URL. Ensures globalThis.location.replace is triggered with the
 * exact URL returned by the API on success. Validates that isError becomes true
 * when the API returns a non-OK status (e.g., 404). Confirms isLoading and isError
 * states are managed correctly.
 */
describe("useLinkResolver Hook", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();

    vi.stubGlobal("console", { ...console, log: vi.fn() });

    vi.stubGlobal("location", { replace: vi.fn() });

    vi.stubGlobal("fetch", vi.fn());
  });

  it("should successfully resolve a link and perform a hard redirect", async () => {
    const mockCode = "UkLWZg";
    const mockOriginalUrl = "https://ockhamlink.com";

    vi.mocked(useParams).mockReturnValue({ code: mockCode });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ originalUrl: mockOriginalUrl }),
    } as Response);

    const { result } = renderHook(() => useLinkResolver(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(globalThis.location.replace).toHaveBeenCalledWith(mockOriginalUrl);
    });

    expect(result.current.isError).toBe(false);
    expect(fetch).toHaveBeenCalledWith(
      `${ENV.API_BASE_URL}${API_ENDPOINTS.RESOLVE}/${mockCode}`,
    );
  });

  it("should handle 404 or network errors correctly", async () => {
    const mockCode = "invalidCode";

    vi.mocked(useParams).mockReturnValue({ code: mockCode });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const { result } = renderHook(() => useLinkResolver(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(globalThis.location.replace).not.toHaveBeenCalled();
  });

  it("should not execute query if code is missing", () => {
    vi.mocked(useParams).mockReturnValue({ code: undefined });

    const { result } = renderHook(() => useLinkResolver(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});
