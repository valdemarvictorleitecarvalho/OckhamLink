import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RedirectPage } from "./redirect-page";
import { useLinkResolver } from "./hooks/use-link-resolver";

vi.mock("./hooks/use-link-resolver");

vi.mock("./components/redirect-loading", () => ({
  RedirectLoading: () => <div data-testid="loading-screen" />,
}));

vi.mock("./components/redirect-error", () => ({
  RedirectError: () => <div data-testid="error-screen" />,
}));

/**
 * Test suite for the RedirectPage orchestrator.
 * Verifies that the component correctly switches between
 * Loading, Error, and Null states based on the hook's return values.
 * Ensures that the correct sub-components are mounted
 * without direct dependency on their internal implementation (using mocks).
 */
describe("RedirectPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render RedirectLoading when isLoading is true", () => {
    vi.mocked(useLinkResolver).mockReturnValue({
      isLoading: true,
      isError: false,
    });

    render(<RedirectPage />);

    expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
    expect(screen.queryByTestId("error-screen")).not.toBeInTheDocument();
  });

  it("should render RedirectError when isError is true", () => {
    vi.mocked(useLinkResolver).mockReturnValue({
      isLoading: false,
      isError: true,
    });

    render(<RedirectPage />);

    expect(screen.getByTestId("error-screen")).toBeInTheDocument();
    expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
  });

  it("should render null when both isLoading and isError are false", () => {
    vi.mocked(useLinkResolver).mockReturnValue({
      isLoading: false,
      isError: false,
    });

    const { container } = render(<RedirectPage />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-screen")).not.toBeInTheDocument();
  });
});
