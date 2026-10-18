// Theme preference. Light is the default whatever the OS prefers; a stored
// "dark" (the lamp switched off) sets `data-theme` on <html>.
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "gabpaet.theme.v2";

// Runs before first paint (see app/layout.tsx). Applies a stored choice, so a
// visitor who switched the lamp off keeps the night page without a flash.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;
