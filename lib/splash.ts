// The splash signature (spec 6.15). It may only play on the home page, once
// per browser session, never for a deep link (#hash), under reduced motion
// or without JS. This script makes that call before first paint and flags it
// with `html.splash`; CSS shows the sheet only under that class, so nothing
// flashes and no-JS visitors never see it.
export const SPLASH_STORAGE_KEY = "gabpaet.splash.v2";

/** How long the signature takes, then the lift (ms). Total stays ≤ 1.2s. */
export const SPLASH_SIGN_MS = 950;
export const SPLASH_LIFT_MS = 300;

export const SPLASH_INIT_SCRIPT = `(function(){try{var d=document.documentElement,l=location;if(l.pathname!=="/"||l.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(sessionStorage.getItem(${JSON.stringify(
  SPLASH_STORAGE_KEY,
)}))return;sessionStorage.setItem(${JSON.stringify(SPLASH_STORAGE_KEY)},"1");d.classList.add("splash")}catch(e){}})();`;
