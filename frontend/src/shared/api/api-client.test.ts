import { describe, expect, it, vi } from "vitest";

vi.mock("../@constants", () => ({
  ENV: {
    API_BASE_URL: "https://mocked-backend-url.com",
  },
}));

import { apiClient } from "./api-client";

/**
 * Unit tests for the API Client configuration.
 * Verifies if the Axios instance was correctly initialized with the environment's base URL
 * and the default JSON content-type headers.
 */
describe("API Client Configuration", () => {
  it("should be configured with the correct base URL from ENV", () => {
    expect(apiClient.defaults.baseURL).toBe("https://mocked-backend-url.com");
  });

  it("should have 'application/json' as the default Content-Type header", () => {
    const headers = apiClient.defaults.headers as Record<
      string,
      string | undefined
    >;

    const commonHeaders = apiClient.defaults.headers.common as
      | Record<string, string | undefined>
      | undefined;

    const hasJsonContentType =
      headers["Content-Type"] === "application/json" ||
      commonHeaders?.["Content-Type"] === "application/json";

    expect(hasJsonContentType).toBe(true);
  });
});
