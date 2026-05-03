import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

/**
 * Application Entry Point.
 * Bootstraps the React application, rendering the root `App` component into the DOM.
 * Wrapped in `StrictMode` to highlight potential problems in the application during development.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
