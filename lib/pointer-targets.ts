// What a pointer can land on that is not plain paper. Shared by the pen
// cursor (spec 5.3), which changes shape over these, and the paper marks
// (spec 5.2), which never land on them.

/** Controls: links, buttons and their kin. */
export const INTERACTIVE = 'a[href], button, [role="button"], summary, label[for]';

/** Things that keep the system cursor (it says something the dot cannot):
    fields, draggable stickers and notebook card title bars, disabled
    controls. globals.css repeats the fields, stickers, card title bars and
    disabled controls under html.has-pen-cursor; keep them in step. */
export const NATIVE =
  'input, textarea, select, [contenteditable=""], [contenteditable="true"], .sticker-grab, .card-handle, :disabled, [aria-disabled="true"]';
