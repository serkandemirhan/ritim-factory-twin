import type { ApplicationMode } from "../../types/factory";
import { TransformToolbar } from "../factory/TransformToolbar";

interface TopBarProps {
  applicationMode: ApplicationMode;
  activeTransformMode: "select" | "move" | "rotate";
  onApplicationModeChange: (mode: ApplicationMode) => void;
  onTransformModeChange: (mode: "select" | "move" | "rotate") => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  lastSavedAt: string | null;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isLibraryOpen: boolean;
  onLibraryToggle: () => void;
  isMobileOperationsOnly: boolean;
  isActivityOpen: boolean;
  onActivityToggle: () => void;
}

function formatSavedAt(savedAt: string | null): string {
  if (!savedAt) {
    return "Not saved yet";
  }

  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    month: "short",
    day: "2-digit",
  }).format(new Date(savedAt));
}

export function TopBar({
  applicationMode,
  activeTransformMode,
  onApplicationModeChange,
  onTransformModeChange,
  onSave,
  onLoad,
  onReset,
  lastSavedAt,
  isFullscreen,
  onToggleFullscreen,
  isLibraryOpen,
  onLibraryToggle,
  isMobileOperationsOnly,
  isActivityOpen,
  onActivityToggle,
}: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="brand-block">
        <div>
          <h1>Ritim Factory Twin</h1>
        </div>
        {!isMobileOperationsOnly && <div className="mode-toggle">
          <button
            className={applicationMode === "operations" ? "mode-button is-active" : "mode-button"}
            onClick={() => onApplicationModeChange("operations")}
            type="button"
          >
            Operations
          </button>
          <button
            className={applicationMode === "design" ? "mode-button is-active" : "mode-button"}
            onClick={() => onApplicationModeChange("design")}
            type="button"
          >
            Design
          </button>
        </div>}
      </div>

      <div className="top-bar-controls">
        {applicationMode === "design" && (
          <TransformToolbar
            activeMode={activeTransformMode}
            onModeChange={onTransformModeChange}
            allowRotate={false}
          />
        )}
        <div className="action-cluster">
          {isMobileOperationsOnly && (
            <button
              className={isActivityOpen ? "activity-toggle is-active" : "activity-toggle"}
              onClick={onActivityToggle}
              type="button"
              aria-label={isActivityOpen ? "Hide activity panel" : "Show activity panel"}
              title={isActivityOpen ? "Hide activity" : "Show activity"}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M4 18V10m5 8V5m5 13v-6m5 6V8" />
              </svg>
            </button>
          )}
          <button
            className="fullscreen-button"
            onClick={onToggleFullscreen}
            type="button"
            aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
            title={isFullscreen ? "Exit full screen" : "Full screen"}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              {isFullscreen ? (
                <path d="M9 3v6H3m12-6v6h6M9 21v-6H3m12 6v-6h6" />
              ) : (
                <path d="M9 3H3v6m12-6h6v6M9 21H3v-6m12 6h6v-6" />
              )}
            </svg>
          </button>
          {applicationMode === "design" && (
            <button className="library-toggle" onClick={onLibraryToggle} type="button">
              {isLibraryOpen ? "Hide Library" : "Open Library"}
            </button>
          )}
          {applicationMode === "design" && (
            <>
              <button className="toolbar-button" onClick={onSave} type="button">
                Save Layout
              </button>
              <button className="toolbar-button" onClick={onLoad} type="button">
                Load Layout
              </button>
              <button className="toolbar-button" onClick={onReset} type="button">
                Reset Demo Layout
              </button>
            </>
          )}
        </div>
        {applicationMode === "design" && (
          <span className="save-status">{formatSavedAt(lastSavedAt)}</span>
        )}
      </div>
    </header>
  );
}
