/**
 * Properties for the OverlayPanel component.
 * Controls the animation state and the interaction to switch between app modes.
 */
export interface OverlayPanelProps {
  isActive: boolean;
  onToggle: () => void;
}
