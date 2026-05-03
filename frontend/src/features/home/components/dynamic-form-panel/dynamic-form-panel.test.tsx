import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

  afterEach(() => {
    vi.useRealTimers();
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

  it("should render the brand logo if logoSrc is provided", () => {
    render(
      <DynamicFormPanel {...defaultProps} logoSrc="https://mock-logo.png" />,
    );

    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "https://mock-logo.png");
  });

  it("should handle the full user journey: type, submit, loading, success, and reset", async () => {
    let resolveSubmit: (value: {
      resultUrl: string;
      qrCodeUrl: string;
    }) => void;
    const mockSubmit = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<DynamicFormPanel {...defaultProps} onSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText("Paste your long URL here");
    const submitBtn = screen.getByRole("button", { name: "Shorten Link" });

    fireEvent.change(input, {
      target: { value: "https://my-huge-website.com/path" },
    });
    fireEvent.click(submitBtn);

    const loadingBtn = screen.getByRole("button", { name: "Processing" });
    expect(loadingBtn).toBeInTheDocument();
    expect(loadingBtn).toBeDisabled();

    await act(async () => {
      resolveSubmit({
        resultUrl: "https://ock.hm/123",
        qrCodeUrl: "https://fake-qr.com/img.png",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("https://ock.hm/123")).toBeInTheDocument();
    });

    const qrImage = screen.getByAltText("QR Code");
    expect(qrImage).toHaveAttribute("src", "https://fake-qr.com/img.png");

    const resetBtn = screen.getByText("Shorten another link");

    await act(async () => {
      fireEvent.click(resetBtn);
    });

    expect(
      screen.getByPlaceholderText("Paste your long URL here"),
    ).toBeInTheDocument();
    expect(screen.queryByText("https://ock.hm/123")).not.toBeInTheDocument();
  });

  it("should render success without QR code and handle safe clipboard copy interaction", async () => {
    const mockSubmit = vi.fn().mockResolvedValue({
      resultUrl: "https://ock.hm/no-qr",
    });

    render(<DynamicFormPanel {...defaultProps} onSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText("Paste your long URL here");
    const submitBtn = screen.getByRole("button", { name: "Shorten Link" });

    await act(async () => {
      fireEvent.change(input, { target: { value: "https://test.com" } });
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(screen.getByText("https://ock.hm/no-qr")).toBeInTheDocument();
    });

    expect(screen.queryByAltText("QR Code")).not.toBeInTheDocument();

    vi.useFakeTimers();

    const copyBtn = screen.getByTitle("Copy to clipboard");
    expect(copyBtn.querySelector(".fa-copy")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "https://ock.hm/no-qr",
    );
    expect(copyBtn.querySelector(".fa-check")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(copyBtn.querySelector(".fa-copy")).toBeInTheDocument();
  });
});
