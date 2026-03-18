import { useEffect, useState } from "react";
import { CheckIcon, PaletteIcon } from "lucide-react";

const THEMES = [
  "forest",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "light",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

const ThemeSelector = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "forest";
    }
    return "forest";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <PaletteIcon className="size-3.5 text-base-content/50" />
        <span className="text-xs font-semibold text-base-content/50 uppercase tracking-widest">
          Theme
        </span>
        <span className="ml-auto text-xs font-medium text-primary capitalize">
          {theme}
        </span>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
        {THEMES.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            data-theme={t}
            className={`group relative flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all duration-200 border ${
              theme === t
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-base-content/10 bg-base-100 hover:border-base-content/25 hover:bg-base-200"
            }`}
          >
            {/* Color swatches — all driven by the data-theme attribute */}
            <div className="flex gap-0.5 shrink-0">
              <span className="w-2.5 h-5 rounded-sm bg-primary" />
              <span className="w-2.5 h-5 rounded-sm bg-secondary" />
              <span className="w-2.5 h-5 rounded-sm bg-accent" />
              <span className="w-2.5 h-5 rounded-sm bg-neutral" />
            </div>

            {/* Label */}
            <span
              className={`text-xs font-medium capitalize truncate flex-1 text-left ${
                theme === t ? "text-primary" : "text-base-content"
              }`}
            >
              {t}
            </span>

            {/* Active check */}
            {theme === t && (
              <CheckIcon className="size-3 text-primary shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Scrollbar styling hint via inline style — no hardcoded colors */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { 
          background: oklch(var(--bc) / 0.2); 
          border-radius: 999px; 
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { 
          background: oklch(var(--bc) / 0.35); 
        }
      `}</style>
    </div>
  );
};

export default ThemeSelector;
