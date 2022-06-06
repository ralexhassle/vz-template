export enum PATHS {}

export enum ERRORS {}

export enum STATUS {
  IDLE = "idle",
  PENDING = "pending",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

export enum PORTAL_ID {
  NAVIGATION = "navigation",
  FOOTER = "footer",
  DIALOG = "dialog",
  ACTION = "action",
  TOAST = "toast",
}

export const PORTALS = {
  NAVIGATION: { id: PORTAL_ID.NAVIGATION, zIndex: 2 },
  FOOTER: { id: PORTAL_ID.FOOTER, zIndex: 1 },
  DIALOG: { id: PORTAL_ID.DIALOG, zIndex: 999 },
  ACTION: { id: PORTAL_ID.ACTION, zIndex: 998 },
  TOAST: { id: PORTAL_ID.TOAST, zIndex: 998 },
} as const;
