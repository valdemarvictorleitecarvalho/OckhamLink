import { RedirectPage } from "@/features/redirect/redirect-page";
import { HomePage } from "@features/home/home-page";
import { HOME_ROUTE, REDIRECT_ROUTE } from "@shared/routes";

/**
 * Application routes definition.
 * Each route contains:
 * - path: the route URL path
 * - element: the component to render
 */
export const routes = [
  {
    path: HOME_ROUTE,
    element: <HomePage />,
  },
  {
    path: REDIRECT_ROUTE,
    element: <RedirectPage />,
  },
];
