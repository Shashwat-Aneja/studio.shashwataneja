import { useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

type Props = {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

const labels: Record<ThemeMode, string> = {
  light: "Day",
  dark: "Night",
  system: "System",
};

export default function ThemeToggle({ mode, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="atmosphere" data-interactive>
      <button
        type="button"
        className="atmosphere-trigger"
        aria-expanded={open}
        aria-controls="atmosphere-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="atmosphere-dot" aria-hidden="true" />
        <span>Change the atmosphere</span>
        <span className="atmosphere-arrow" aria-hidden="true">{open ? "↑" : "↓"}</span>
      </button>

      {open && (
        <div className="atmosphere-menu" id="atmosphere-menu" role="menu">
          {(Object.keys(labels) as ThemeMode[]).map((item) => (
            <button
              key={item}
              type="button"
              role="menuitemradio"
              aria-checked={mode === item}
              className={mode === item ? "atmosphere-option active" : "atmosphere-option"}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
            >
              <span>{labels[item]}</span>
              <span className="mono">{mode === item ? "ACTIVE" : item.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
