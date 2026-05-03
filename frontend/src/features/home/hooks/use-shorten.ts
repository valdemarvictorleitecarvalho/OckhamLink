import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/api-client";
import { API_ENDPOINTS, ENV, EXTERNAL_API } from "@shared/@constants";
import type { ShortenResponse } from "./@types";

/**
 * Custom React Query hook for shortening a long URL.
 * Submits the long URL to the backend, receives a unique short code, and constructs
 * the final, shareable short URL using the application's environment configuration.
 * It also generates a QR code pointing to the newly created short link.
 *
 * @returns A TanStack Query mutation object providing state (isLoading, error) and the `mutateAsync`
 * execution function.
 */
export const useShorten = () => {
  return useMutation({
    mutationFn: async (urlToShorten: string) => {
      const { data: shortCode } = await apiClient.post<ShortenResponse>(
        API_ENDPOINTS.SHORTEN,
        {
          url: urlToShorten,
        },
      );

      const baseDomain = ENV.SHORT_DOMAIN.replace(/\/$/, "");
      const finalShortUrl = `${baseDomain}/${shortCode}`;

      const qrCodeUrl = `${EXTERNAL_API.QR_CODE_GENERATOR}${encodeURIComponent(
        finalShortUrl,
      )}`;

      return {
        resultUrl: finalShortUrl,
        qrCodeUrl,
      };
    },
  });
};
