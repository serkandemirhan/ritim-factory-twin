import type { TransformMode } from "../../types/factory";

interface TransformToolbarProps {
  activeMode: TransformMode;
  onModeChange: (mode: TransformMode) => void;
  allowRotate: boolean;
}

const modes: TransformMode[] = ["select", "move", "rotate"];

export function TransformToolbar({ activeMode, onModeChange, allowRotate }: TransformToolbarProps) {
  return (
    <div className="transform-toolbar">
      {modes.filter((mode) => allowRotate || mode !== "rotate").map((mode) => (
        <button
          key={mode}
          className={activeMode === mode ? "toolbar-button is-active" : "toolbar-button"}
          onClick={() => onModeChange(mode)}
          type="button"
        >
          {mode.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
