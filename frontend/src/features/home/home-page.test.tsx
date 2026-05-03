import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomePage } from "./home-page";
import { useShorten } from "./hooks/use-shorten";
import { useResolve } from "./hooks/use-resolve";

vi.mock("./hooks/use-shorten", () => ({
  useShorten: vi.fn(),
}));

vi.mock("./hooks/use-resolve", () => ({
  useResolve: vi.fn(),
}));

vi.mock("@/assets/ockham-logo-render.png", () => ({
  default: "mocked-logo-path",
}));

type ShortenHookResult = ReturnType<typeof useShorten>;
type ResolveHookResult = ReturnType<typeof useResolve>;

const renderHomePage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>,
  );
};

/**
 * Unit tests for the HomePage orchestrator component. These tests cover rendering of the component with default state, toggling
 * of the isActive state through the OverlayPanel, and the proper passing of mutation triggers to the DynamicFormPanel components.
 * The tests ensure that the HomePage component correctly manages its internal state and integrates with the useShorten and useResolve
 * hooks, providing confidence in its functionality as the main landing page and orchestrator of the application.
 */
describe("HomePage Orchestrator", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useShorten as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isLoading: false,
      isError: false,
    } as Partial<ShortenHookResult> as ShortenHookResult);

    (useResolve as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isLoading: false,
      isError: false,
    } as Partial<ResolveHookResult> as ResolveHookResult);
  });

  it("should render correctly with default 'shorten' state", () => {
    renderHomePage();
    const container = screen.getByRole("main").firstChild;
    expect(container).toHaveAttribute("data-active", "false");
    expect(screen.getByText("Ockham")).toBeInTheDocument();
  });

  it("should toggle 'isActive' state when OverlayPanel triggers onToggle", async () => {
    renderHomePage();
    const container = screen.getByRole("main").querySelector(".container");
    const toggleBtn = screen.getByRole("button", {
      name: /Resolve a Link/i,
    });

    await act(async () => {
      fireEvent.click(toggleBtn);
    });

    expect(container).toHaveAttribute("data-active", "true");
  });

  it("should pass the correct mutation triggers to the panels", async () => {
    const mockShortenMutate = vi.fn().mockResolvedValue({
      resultUrl: "ok",
    });

    (useShorten as Mock).mockReturnValue({
      mutateAsync: mockShortenMutate,
      isLoading: false,
    } as Partial<ShortenHookResult> as ShortenHookResult);

    (useResolve as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isLoading: false,
    } as Partial<ResolveHookResult> as ResolveHookResult);

    renderHomePage();

    const shortenInput = screen.getByPlaceholderText(
      /Paste your long URL here/i,
    );

    await act(async () => {
      fireEvent.change(shortenInput, {
        target: { value: "https://test.com" },
      });
    });

    const shortenBtn = screen.getByRole("button", { name: "Shorten Link" });

    await act(async () => {
      fireEvent.click(shortenBtn);
    });

    expect(mockShortenMutate).toHaveBeenCalledWith("https://test.com");
  });
});
