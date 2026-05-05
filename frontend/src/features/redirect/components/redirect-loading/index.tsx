import "./redirect-loading.css";

/**
 * A presentational component that renders a full-screen loading state.
 * * This component is displayed to the user during the brief network latency
 * window while the `useLinkResolver` hook is communicating with the backend
 * to find the original URL destination.
 * * It features a centered gradient spinner and includes an ARIA label
 * to ensure screen readers announce the loading state properly.
 *
 * @returns {JSX.Element} The rendered loading screen layout.
 */
export const RedirectLoading = () => {
  return (
    <main className="redirect-layout">
      <div className="gradient-spinner" aria-label="Resolving link..." />
    </main>
  );
};
