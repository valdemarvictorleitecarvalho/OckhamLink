import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DynamicFormPanel } from ".";

Object.assign(navigator, {
  clipboard: { writeText: vi.fn() },
});

/**
 * Unit tests for the DynamicFormPanel component. These tests cover rendering of both "shorten" and "resolve" variants,
 * as well as the full user interaction flow including input changes, form submission, loading state, successful result display,
 * and reset functionality. The tests ensure that the component behaves correctly under various scenarios and that all UI elements
 * are present and functional as expected.
 */
describe("DynamicFormPanel Component", () => {
  const defaultProps = {
    isActive: true,
    type: "shorten" as const,
    headerTitle: "OckhamLink",
    inputPlaceholder: "Paste your long URL here",
    submitButtonText: "Shorten Link",
    onResetText: "Shorten another link",
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the 'shorten' form variant correctly", () => {
    render(
      <DynamicFormPanel {...defaultProps} headerSubtitle="SHORTEN THE WEB" />,
    );

    expect(screen.getByText("OckhamLink")).toBeInTheDocument();
    expect(screen.getByText("SHORTEN THE WEB")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Paste your long URL here");
    expect(input).toHaveAttribute("type", "url");

    expect(
      screen.getByRole("button", { name: "Shorten Link" }),
    ).toBeInTheDocument();
  });

  it("should render the 'resolve' form variant correctly", () => {
    render(
      <DynamicFormPanel
        {...defaultProps}
        type="resolve"
        headerDescription="Inspect before clicking."
      />,
    );

    expect(screen.getByText("Inspect before clicking.")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Paste your long URL here");
    expect(input).toHaveAttribute("type", "text");
  });

  it("should handle the full user journey: type, submit, loading, success, and reset", async () => {
    const mockSubmit = vi.fn().mockResolvedValue({
      resultUrl: "https://ock.hm/123",
      qrCodeUrl: "https://fake-qr.com/img.png",
    });

    render(<DynamicFormPanel {...defaultProps} onSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText("Paste your long URL here");
    const submitBtn = screen.getByRole("button", { name: "Shorten Link" });

    fireEvent.change(input, {
      target: { value: "https://my-huge-website.com/path" },
    });
    expect(input).toHaveValue("https://my-huge-website.com/path");

    fireEvent.click(submitBtn);

    const loadingBtn = screen.getByRole("button", { name: "Processing" });
    expect(loadingBtn).toBeInTheDocument();
    expect(loadingBtn).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText("https://ock.hm/123")).toBeInTheDocument();
    });

    const qrImage = screen.getByAltText("QR Code");
    expect(qrImage).toHaveAttribute("src", "https://fake-qr.com/img.png");

    const resetBtn = screen.getByText("Shorten another link");
    fireEvent.click(resetBtn);

    expect(
      screen.getByPlaceholderText("Paste your long URL here"),
    ).toBeInTheDocument();
    expect(screen.queryByText("https://ock.hm/123")).not.toBeInTheDocument();
  });
});
