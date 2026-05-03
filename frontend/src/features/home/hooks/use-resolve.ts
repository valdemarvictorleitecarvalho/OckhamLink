import { apiClient } from "@shared/api/api-client";
import { useMutation } from "@tanstack/react-query";
import type { ResolveResponse } from "./@types";
import { API_ENDPOINTS, EXTERNAL_API } from "@shared/@constants";

/**
 * Custom React Query hook for resolving a short code back to its original URL.
 * This hook is smart enough to handle both raw short codes (e.g., "abc123")
 * and full short URLs (e.g., "ockham.link/abc123") by extracting the last segment.
 * It queries the backend and appends a generated QR code for the original destination.
 *
 * @returns A TanStack Query mutation object providing state (isLoading, error) and the `mutateAsync`
 * execution function.
 */
export const useResolve = () => {
  return useMutation({
    mutationFn: async (inputCodeOrUrl: string) => {
      const shortCode = inputCodeOrUrl.split("/").pop()?.trim();

      if (!shortCode) throw new Error("Invalid short code");

      const { data } = await apiClient.get<ResolveResponse>(
        `${API_ENDPOINTS.RESOLVE}/${shortCode}`,
      );

      const qrCodeUrl = `${EXTERNAL_API.QR_CODE_GENERATOR}${encodeURIComponent(
        data.originalUrl,
      )}`;

      return {
        resultUrl: data.originalUrl,
        qrCodeUrl,
      };
    },
  });
};
