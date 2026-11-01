// The only z-index values in the app. Mirrored as --z-* in app/globals.css.
// Spec section 4.6. /notebook has no nav or mobile menu, so its desk UI
// reuses their levels.
export const z = {
  base: 0,
  sticker: 10,
  stickerDragging: 20,
  pencil: 30,
  nav: 40,
  /** /notebook: toolbar, dock and zoom. */
  deskUi: 40,
  mobileMenu: 50,
  /** /notebook: the phone's bottom sheet. */
  deskSheet: 50,
  /** /notebook: the first-visit tour's notes. */
  deskTour: 55,
  toast: 60,
  grain: 65,
  splash: 70,
  cursor: 80,
} as const;
