import { useNavigate } from "react-router-dom";
import { HOME_ROUTE } from "@shared/routes";

import "./redirect-error.css";

/**
 * A presentational component that renders the 404 error state for invalid short links.
 * * This component is displayed when the `useLinkResolver` hook receives an error
 * from the backend (e.g., the short code does not exist or has expired).
 * It features a stylized glassmorphism UI card and provides a call-to-action button
 * that safely navigates the user back to the application's home page, replacing
 * the current history entry to prevent back-button loops.
 *
 * @returns {JSX.Element} The rendered 404 error screen layout.
 */
export const RedirectError = () => {
  const navigate = useNavigate();

  return (
    <main className="redirect-layout">
      <div className="error-glass-card">
        <h1 className="gradient-text-404">404</h1>
        <h2>Link not found</h2>
        <p>
          This link might have expired, or it never existed in the first place.
          Double-check the URL and try again.
        </p>
        <button
          className="btn-return-home"
          onClick={() => navigate(HOME_ROUTE, { replace: true })}
        >
          Return to Home
        </button>
      </div>
    </main>
  );
};
