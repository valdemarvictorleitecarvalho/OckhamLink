import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { routes } from "./config/routes-config";
import { HOME_ROUTE } from "@shared/routes";

/**
 * Creates the router using React Router v6 createBrowserRouter.
 * Adds a fallback route to redirect users.
 */
const router = createBrowserRouter([
  ...routes.map((route) => ({
    path: route.path,
    element: route.element,
  })),
  { path: "*", element: <Navigate to={HOME_ROUTE} replace /> },
]);

/**
 * Routes component.
 * Provides routing context for the application by rendering the configured router.
 *
 * @returns {JSX.Element} The <RouterProvider> with all routes configured.
 */
export function Routes() {
  return <RouterProvider router={router} />;
}
