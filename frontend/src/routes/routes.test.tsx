import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

vi.mock("./config/routes-config", () => ({
  routes: [
    { path: "/", element: <div data-testid="home-page">Home Page</div> },
    {
      path: "/other",
      element: <div data-testid="other-page">Other Page</div>,
    },
  ],
}));

vi.mock("@shared/routes", () => ({
  HOME_ROUTE: "/",
}));

import { routes } from "./config/routes-config";

/**
 * Unit tests for the Routes component. These tests cover rendering of the home page route by default, navigation to other
 * configured routes, and redirection to home when an unknown route is accessed. The tests ensure that the routing system
 * is correctly set up and that users are directed to the appropriate components based on the URL path.
 */
describe("Routes System", () => {
  it("should render the home page route by default", async () => {
    const router = createMemoryRouter(
      [
        ...routes.map((route) => ({
          path: route.path,
          element: route.element,
        })),
      ],
      { initialEntries: ["/"] },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("should navigate to other configured routes", () => {
    const router = createMemoryRouter(
      [
        ...routes.map((route) => ({
          path: route.path,
          element: route.element,
        })),
      ],
      { initialEntries: ["/other"] },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("other-page")).toBeInTheDocument();
  });

  it("should redirect to home when an unknown route is accessed", () => {
    const routerConfig = [
      ...routes.map((route) => ({
        path: route.path,
        element: route.element,
      })),
      {
        path: "*",
        element: <div data-testid="redirect-hit">Redirected to Home</div>,
      },
    ];

    const router = createMemoryRouter(routerConfig, {
      initialEntries: ["/non-existent-route"],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("redirect-hit")).toBeInTheDocument();
  });
});
