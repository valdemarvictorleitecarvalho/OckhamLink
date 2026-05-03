import axios from "axios";
import { ENV } from "../@constants";

/**
 * Global Axios instance configured for the application.
 * This client serves as the primary gateway for all HTTP requests to the internal backend.
 * It automatically applies the base URL defined in the environment variables and ensures
 * that all requests are formatted as JSON. Interceptors (for auth tokens, global error handling, etc.)
 * can be attached to this instance in the future.
 */
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
