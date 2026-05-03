import { useState } from "react";
import type { UseDynamicFormProps } from "./@types";

/**
 * Custom hook that encapsulates the state and interaction logic for dynamic form panels.
 * Handles input management, asynchronous submission, loading states, and clipboard operations.
 *
 * @param props - The configuration object.
 * @param props.onSubmit - The asynchronous callback executed when the form is submitted.
 * @returns An object containing the current state variables and handler functions to bind to the UI.
 */
export const useDynamicForm = ({ onSubmit }: UseDynamicFormProps) => {
  const [inputValue, setInputValue] = useState("");
  const [resultData, setResultData] = useState<{
    resultUrl: string;
    qrCodeUrl?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the form submission event.
   *
   * Prevents default browser behavior, triggers the loading state, and awaits the `onSubmit` prop.
   * @param e - The synthetic form event.
   */
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await onSubmit(inputValue);
      setResultData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Copies the resolved/shortened URL to the user's clipboard.
   * Temporarily toggles the `copied` state to true for 2 seconds to provide visual feedback.
   */
  const handleCopy = async () => {
    if (resultData) {
      await navigator.clipboard.writeText(resultData.resultUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Resets the form to its initial state, clearing the input field and removing the result data.
   */
  const resetForm = () => {
    setResultData(null);
    setInputValue("");
  };

  return {
    inputValue,
    setInputValue,
    resultData,
    copied,
    isLoading,
    handleSubmit,
    handleCopy,
    resetForm,
  };
};
