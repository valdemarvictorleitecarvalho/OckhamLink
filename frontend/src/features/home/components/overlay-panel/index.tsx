import type { OverlayPanelProps } from "./@types";

import "./overlay-panel.css";

/**
 * A presentation component that renders the sliding overlay panel.
 * This panel acts as a visual "curtain" that covers the currently inactive form.
 * It provides the primary calls-to-action (CTAs) for switching the application's
 * context between creating short links and inspecting existing ones.
 * The sliding animation is fully handled by CSS, reacting to the `data-active` attribute.
 *
 * @param props - The properties defined in `OverlayPanelProps`.
 * @returns The rendered React element for the overlay.
 */
export const OverlayPanel = ({
  isActive,
  onToggle,
}: Readonly<OverlayPanelProps>) => {
  return (
    <aside className="overlay-container" data-active={isActive}>
      <div className="overlay-content">
        <section className="toggle-panel toggle-left">
          <h1>Shave the excess.</h1>
          <p>
            Create compact, elegant links instantly. Generate QR Codes and share
            them with the world.
          </p>
          <button type="button" className="btn-outline" onClick={onToggle}>
            Shorten a Link
          </button>
        </section>

        <section className="toggle-panel toggle-right">
          <h1>Simplify the truth.</h1>
          <p>
            Have an OckhamLink? Discover its original destination safely before
            clicking.
          </p>
          <button type="button" className="btn-outline" onClick={onToggle}>
            Resolve a Link
          </button>
        </section>
      </div>
    </aside>
  );
};
