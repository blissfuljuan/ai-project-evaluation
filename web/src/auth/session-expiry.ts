export const SESSION_EXPIRED_EVENT = "app:session-expired";

type SessionExpiredDetail = {
  message: string;
};

let sessionExpiredOpen = false;

export function notifySessionExpired(message: string) {
  if (sessionExpiredOpen) {
    return;
  }

  sessionExpiredOpen = true;
  window.dispatchEvent(
    new CustomEvent<SessionExpiredDetail>(SESSION_EXPIRED_EVENT, {
      detail: { message },
    })
  );
}

export function resetSessionExpiredNotification() {
  sessionExpiredOpen = false;
}
