import { useState } from "react";
import { DynamicFormPanel } from "./components/dynamic-form-panel";
import { OverlayPanel } from "./components/overlay-panel";
import { useShorten } from "./hooks/use-shorten";
import { useResolve } from "./hooks/use-resolve";
import ockhamLogo from "@/assets/ockham-logo-render.png";

import "./home-page.css";

/**
 * The main landing page and orchestrator component of the application.
 * This component acts as the primary "Container" in the architecture. It is responsible for:
 * 1. Managing the global UI state (`isActive`) that drives the sliding animation between the two application modes.
 * 2. Instantiating the API mutation hooks (`useShorten` and `useResolve`).
 * 3. Composing the presentation components (`DynamicFormPanel` and `OverlayPanel`) and injecting the necessary logic
 * and text configurations into them.
 *
 * @returns The rendered layout containing the dual-pane interface and the sliding overlay.
 */
export const HomePage = () => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => setIsActive((prev) => !prev);

  const shortenMutation = useShorten();
  const resolveMutation = useResolve();

  return (
    <main className="home-wrapper">
      <div className="container" data-active={isActive}>
        <DynamicFormPanel
          isActive={isActive}
          type="resolve"
          headerTitle="Reveal Destination"
          headerDescription="Enter an OckhamLink code or URL to safely inspect where it leads before clicking."
          inputPlaceholder="abc123 or ockham.link/abc123"
          submitButtonText="Resolve Link"
          onResetText="Inspect another link"
          onSubmit={(url) => resolveMutation.mutateAsync(url)}
        />

        <DynamicFormPanel
          isActive={isActive}
          type="shorten"
          logoSrc={ockhamLogo}
          headerTitle={
            <>
              <span className="brand-ockham">Ockham</span>
              <span className="brand-link">Link</span>
            </>
          }
          headerSubtitle="SHORTEN. REDIRECT. CONNECT."
          inputPlaceholder="Paste your long URL here"
          submitButtonText="Shorten Link"
          onResetText="Shorten another link"
          onSubmit={(url) => shortenMutation.mutateAsync(url)}
        />

        <OverlayPanel isActive={isActive} onToggle={handleToggle} />
      </div>
    </main>
  );
};
