import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, ENV } from "@shared/@constants";

/**
 * Custom React Query hook for resolving a short code and redirecting the user.
 * * This hook acts as an orchestrator for the redirection logic:
 * 1. Captures the dynamic `:code` parameter from the current URL route.
 * 2. Fetches the corresponding original URL from the backend API.
 * 3. Automatically performs a hard redirect (`window.location.replace`) to the
 * destination if the code is valid.
 * 4. Exposes loading and error states to the UI layer to handle fallbacks.
 *
 * @returns {Object} An object containing the current state of the resolution process.
 * @returns {boolean} return.isLoading - `true` while the network request is in progress.
 * @returns {boolean} return.isError - `true` if the network request fails or returns a 404 (Not Found).
 */
export const useLinkResolver = () => {
  const { code } = useParams();

  /**
   * Fetches the original URL from the backend.
   * Throws an error to be caught by React Query if the response is not OK.
   */
  const resolveLink = async (shortCode: string) => {
    const response = await fetch(
      `${ENV.API_BASE_URL}${API_ENDPOINTS.RESOLVE}/${shortCode}`,
    );

    if (!response.ok) throw new Error("Link not found or expired");

    return response.json();
  };

  /**
   * React Query hook to manage the asynchronous resolution of the short code. It is enabled
   * only when a `code` is present in the URL parameters. The `retry: false` option ensures that
   * if the backend returns a 404 (indicating the code is invalid or expired), it will not
   * attempt to retry the request, allowing for immediate error handling in the UI.
   */
  const { data, isError, isLoading } = useQuery({
    queryKey: ["resolve-link", code],
    queryFn: () => resolveLink(code!),
    enabled: !!code,
    retry: false,
  });

  /**
   * Effect to handle successful resolution: If the original URL is successfully retrieved,
   * perform a hard redirect to that URL. This ensures that the user is taken directly
   * to the intended destination without any intermediate steps.
   */
  useEffect(() => {
    console.log("Link resolver data:", data);

    if (data?.originalUrl) {
      globalThis.location.replace(data.originalUrl);
    }
  }, [data]);

  return { isLoading, isError };
};
