import { useDynamicForm } from "./hooks/use-dynamic-form";
import type { DynamicFormPanelProps } from "./@types";

import "./dynamic-form-panel.css";

/**
 * A reusable presentation component that renders either the URL shortening
 * or the URL resolving interface.
 * Following the Container/Presenter pattern, this component delegates all state
 * management and interaction logic to the `useDynamicForm` hook. It conditionally
 * renders an input form or a success state (featuring the result URL, a copy button,
 * and an optional QR code) based on the data returned by the hook.
 *
 * @param props - The configuration and styling properties defined in `DynamicFormPanelProps`.
 * @returns The rendered React element for the dynamic panel.
 */
export const DynamicFormPanel = ({
  isActive,
  type,
  logoSrc,
  headerTitle,
  headerSubtitle,
  headerDescription,
  inputPlaceholder,
  submitButtonText,
  onResetText,
  onSubmit,
}: Readonly<DynamicFormPanelProps>) => {
  const {
    inputValue,
    setInputValue,
    resultData,
    copied,
    isLoading,
    handleSubmit,
    handleCopy,
    resetForm,
  } = useDynamicForm({ onSubmit });

  return (
    <div className={`form-container ${type}-panel`} data-active={isActive}>
      <div className="panel-content">
        <header className="panel-header">
          {logoSrc && <img src={logoSrc} alt="Logo" className="brand-logo" />}
          <h1>{headerTitle}</h1>
          {headerSubtitle && <h3>{headerSubtitle}</h3>}
          {headerDescription && (
            <p className="header-description">{headerDescription}</p>
          )}
        </header>

        <div className="dynamic-form-area">
          {resultData ? (
            <div className="success-group fade-in">
              {resultData.qrCodeUrl && (
                <div className="qr-container">
                  <img src={resultData.qrCodeUrl} alt="QR Code" />
                </div>
              )}

              <div className="copy-box">
                <span className="short-url" title={resultData.resultUrl}>
                  {resultData.resultUrl}
                </span>
                <button
                  type="button"
                  className="btn-copy"
                  onClick={handleCopy}
                  title="Copy to clipboard"
                >
                  <i
                    className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}
                  ></i>
                </button>
              </div>

              <button type="button" className="btn-text" onClick={resetForm}>
                {onResetText}
              </button>
            </div>
          ) : (
            <form className="input-group fade-in" onSubmit={handleSubmit}>
              <input
                type={type === "shorten" ? "url" : "text"}
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Processing" : submitButtonText}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
