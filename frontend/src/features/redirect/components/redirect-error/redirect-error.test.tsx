import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HOME_ROUTE } from "@shared/routes";
import { RedirectError } from ".";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

/**
 * Test suite for the RedirectError presentational component.
 * Ensures that the 404 text, descriptions, and the action button
 * are properly mounted in the DOM. Verifies that clicking the "Return to Home"
 * button triggers the `useNavigate` hook with the correct target
 * route (`HOME_ROUTE`) and the `replace: true` option to prevent history loops.
 */
describe("RedirectError Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the 404 error state correctly", () => {
    render(<RedirectError />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Link not found")).toBeInTheDocument();
    expect(
      screen.getByText(/This link might have expired, or it never existed/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /return to home/i }),
    ).toBeInTheDocument();
  });

  it("should navigate to HOME_ROUTE replacing history when the return button is clicked", () => {
    render(<RedirectError />);

    const returnButton = screen.getByRole("button", {
      name: /return to home/i,
    });

    fireEvent.click(returnButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledWith(HOME_ROUTE, { replace: true });
  });
});
