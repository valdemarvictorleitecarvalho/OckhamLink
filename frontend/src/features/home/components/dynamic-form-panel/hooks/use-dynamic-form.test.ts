import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDynamicForm } from "./use-dynamic-form";

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

/**
 * Unit tests for the useDynamicForm custom hook. These tests cover the initialization of state variables, handling of
 * input changes, form submission logic including successful and error scenarios, clipboard copying functionality, and
 * form reset behavior. The tests ensure that the hook's internal state and side effects behave as expected under various
 * conditions, providing confidence in its reliability and correctness when used within the DynamicFormPanel component.
 */
describe("useDynamicForm Hook", () => {
  const mockOnSubmit = vi.fn();

  const mockFormEvent = {
    preventDefault: vi.fn(),
  } as unknown as React.SyntheticEvent<HTMLFormElement>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with correct default states", () => {
    const { result } = renderHook(() =>
      useDynamicForm({ onSubmit: mockOnSubmit }),
    );

    expect(result.current.inputValue).toBe("");
    expect(result.current.resultData).toBeNull();
    expect(result.current.copied).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("should update inputValue when setInputValue is called", () => {
    const { result } = renderHook(() =>
      useDynamicForm({ onSubmit: mockOnSubmit }),
    );

    act(() => {
      result.current.setInputValue("https://google.com");
    });

    expect(result.current.inputValue).toBe("https://google.com");
  });

  it("should handle a successful form submission", async () => {
    const fakeResponse = { resultUrl: "ock.hm/test", qrCodeUrl: "qr.png" };
    mockOnSubmit.mockResolvedValueOnce(fakeResponse);

    const { result } = renderHook(() =>
      useDynamicForm({ onSubmit: mockOnSubmit }),
    );

    act(() => {
      result.current.setInputValue("https://my-long-url.com");
    });

    await act(async () => {
      await result.current.handleSubmit(mockFormEvent);
    });

    expect(mockFormEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalledWith("https://my-long-url.com");
    expect(result.current.resultData).toEqual(fakeResponse);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle submission errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockOnSubmit.mockRejectedValueOnce(new Error("API Failed"));

    const { result } = renderHook(() =>
      useDynamicForm({ onSubmit: mockOnSubmit }),
    );

    await act(async () => {
      await result.current.handleSubmit(mockFormEvent);
    });

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.current.resultData).toBeNull();
    expect(result.current.isLoading).toBe(false);

    consoleSpy.mockRestore();
  });

  it("should copy to clipboard and reset copied state after 2 seconds", async () => {
    const fakeResult = { resultUrl: "https://copied.com" };
    mockOnSubmit.mockResolvedValueOnce(fakeResult);

    const { result } = renderHook(() =>
      useDynamicForm({ onSubmit: mockOnSubmit }),
    );

    await act(async () => {
      await result.current.handleSubmit(mockFormEvent);
    });

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "https://copied.com",
    );

    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });

  it("should not attempt to copy to clipboard if resultData is null", async () => {
    const { result } = renderHook(() =>
      useDynamicForm({ onSubmit: mockOnSubmit }),
    );

    await act(async () => {
      await result.current.handleCopy();
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    expect(result.current.copied).toBe(false);
  });

  it("should reset the form correctly", () => {
    const { result } = renderHook(() =>
      useDynamicForm({ onSubmit: mockOnSubmit }),
    );

    act(() => {
      result.current.setInputValue("dirty input");
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.inputValue).toBe("");
    expect(result.current.resultData).toBeNull();
  });
});
