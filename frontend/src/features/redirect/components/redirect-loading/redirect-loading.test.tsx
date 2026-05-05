import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RedirectLoading } from ".";

/**
 * Test suite for the RedirectLoading presentational component.
 * Ensures that the main layout container and the spinner
 * are properly mounted in the DOM with their respective CSS classes.
 * Verifies that the spinner includes the correct aria-label
 * so screen readers can announce the loading state to visually impaired users.
 */
describe("RedirectLoading Component", () => {
  it("should render the loading layout and spinner with accessibility attributes", () => {
    render(<RedirectLoading />);

    const mainContainer = screen.getByRole("main");
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass("redirect-layout");

    const spinner = screen.getByLabelText("Resolving link...");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("gradient-spinner");
  });
});
