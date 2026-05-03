import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OverlayPanel } from ".";

/**
 * Unit tests for the OverlayPanel component. These tests cover rendering of both left and right panels with correct texts,
 * the application of the data-active attribute based on the isActive prop, and the invocation of the onToggle callback
 * when either of the outline buttons is clicked. The tests ensure that the component behaves correctly under various
 * scenarios and that all UI elements are present and functional as expected.
 */
describe("OverlayPanel Component", () => {
  const mockOnToggle = vi.fn();

  it("should render both left and right panels with correct texts", () => {
    render(<OverlayPanel isActive={false} onToggle={mockOnToggle} />);

    expect(screen.getByText("Shave the excess.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Shorten a Link" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Simplify the truth.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Resolve a Link" }),
    ).toBeInTheDocument();
  });

  it("should pass data-active='false' to the container when isActive is false", () => {
    const { container } = render(
      <OverlayPanel isActive={false} onToggle={mockOnToggle} />,
    );

    const asideElement = container.firstChild as HTMLElement;
    expect(asideElement).toHaveAttribute("data-active", "false");
  });

  it("should pass data-active='true' to the container when isActive is true", () => {
    const { container } = render(
      <OverlayPanel isActive={true} onToggle={mockOnToggle} />,
    );

    const asideElement = container.firstChild as HTMLElement;
    expect(asideElement).toHaveAttribute("data-active", "true");
  });

  it("should call onToggle when any of the outline buttons are clicked", () => {
    render(<OverlayPanel isActive={false} onToggle={mockOnToggle} />);

    const shortenBtn = screen.getByRole("button", {
      name: "Shorten a Link",
    });
    const resolveBtn = screen.getByRole("button", {
      name: "Resolve a Link",
    });

    fireEvent.click(shortenBtn);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);

    fireEvent.click(resolveBtn);
    expect(mockOnToggle).toHaveBeenCalledTimes(2);
  });
});
