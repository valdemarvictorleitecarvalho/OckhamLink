/**
 * Properties for the DynamicFormPanel component.
 * Centralizes the UI configuration for both shortening and resolving workflows.
 */
export interface DynamicFormPanelProps {
  isActive: boolean;
  type: PanelType;
  logoSrc?: string;
  headerTitle: React.ReactNode;
  headerSubtitle?: string;
  headerDescription?: string;
  inputPlaceholder: string;
  submitButtonText: string;
  onResetText: string;
  onSubmit: (
    inputValue: string,
  ) => Promise<{ resultUrl: string; qrCodeUrl?: string }>;
}

/**
 * Defines the available modes for the dynamic panel.
 * - `shorten`: Used for the URL shortening interface.
 * - `resolve`: Used for the URL inspection/resolving interface.
 */
type PanelType = "shorten" | "resolve";
