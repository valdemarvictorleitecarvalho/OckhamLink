import { HomePage } from "@features/home/home-page";
import { HOME_ROUTE } from "@shared/routes";

/**
 * Application routes definition.
 * Each route contains:
 * - path: the route URL path
 * - element: the component to render
 * - protected: boolean indicating if the route requires authentication
 */
export const routes = [
  {
    path: HOME_ROUTE,
    element: <HomePage />,
    protected: true,
  },
];
