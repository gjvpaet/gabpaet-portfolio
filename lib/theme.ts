// Theme preference. Absent key = follow the OS (`prefers-color-scheme`), which
// globals.css handles on its own; a stored value pins `data-theme` on <html>.
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "gabpaet.theme.v2";

// Runs before first paint (see app/layout.tsx). Only applies an explicit
// choice, so visitors who never touch the toggle keep tracking their OS.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;
