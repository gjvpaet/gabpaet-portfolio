// The splash (spec 6.15): the pen writes Gabriel's name. It may only play
// on the home page, once per browser session, never for a deep link (#hash),
// under reduced motion or without JS. This script makes that call before first paint and flags it
// with `html.splash`; CSS shows the sheet only under that class, so nothing
// flashes and no-JS visitors never see it.
export const SPLASH_STORAGE_KEY = "gabpaet.splash.v2";

/** When the pen should finish (counted from when the portrait's ink loads:
    1.3s of shading, a beat, then 2s of writing), how long the finished name
    is held, and the lift (ms). The lift waits for the last stroke to
    actually finish, so a slow first paint delays it rather than cutting the
    writing short. */
export const SPLASH_SIGN_MS = 3450;
export const SPLASH_HOLD_MS = 250;
/** Gabriel's sketched portrait, shaded in above the name: the traced ink
    (scripts/trace-illustrations.py) and its viewBox. */
export const SPLASH_PORTRAIT = { src: "/illustrations/portrait-ink.svg", w: 1066, h: 1085 } as const;
/** The exit: the name flying into the nav mark (globals.css). */
export const SPLASH_LIFT_MS = 700;

export const SPLASH_INIT_SCRIPT = `(function(){try{var d=document.documentElement,l=location;if(l.pathname!=="/"||l.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(sessionStorage.getItem(${JSON.stringify(
  SPLASH_STORAGE_KEY,
)}))return;sessionStorage.setItem(${JSON.stringify(SPLASH_STORAGE_KEY)},"1");d.classList.add("splash","splash-signing");var k=document.createElement("link");k.rel="preload";k.as="image";k.href=${JSON.stringify(
  SPLASH_PORTRAIT.src,
)};document.head.appendChild(k)}catch(e){}})();`;
