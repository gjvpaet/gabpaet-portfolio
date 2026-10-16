// The only z-index values in the app. Mirrored as --z-* in app/globals.css.
// Spec section 4.6.
export const z = {
  base: 0,
  sticker: 10,
  stickerDragging: 20,
  pencil: 30,
  nav: 40,
  mobileMenu: 50,
  toast: 60,
  grain: 65,
  splash: 70,
} as const;
