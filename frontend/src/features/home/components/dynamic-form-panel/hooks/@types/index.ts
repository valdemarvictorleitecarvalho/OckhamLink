/**
 * Properties for the useDynamicForm custom hook.
 */
export interface UseDynamicFormProps {
  onSubmit: (
    inputValue: string,
  ) => Promise<{ resultUrl: string; qrCodeUrl?: string }>;
}
