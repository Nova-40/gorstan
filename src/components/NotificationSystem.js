
let callback = null;

export function setNotificationCallback(fn) {
  callback = fn;
}

export function displayNotification(message) {
  if (callback) callback(message);
}
