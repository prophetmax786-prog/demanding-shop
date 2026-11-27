export const DESK_PASSWORD = "kingmax";

const KEY = "demanding-desk";

export function deskOpen(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function openDesk() {
  sessionStorage.setItem(KEY, "1");
}

export function closeDesk() {
  sessionStorage.removeItem(KEY);
}