import { createEvent, createStore } from 'effector';

import { isBrowser } from 'shared/lib/browser/is_browser';

const connectionLost = createEvent<unknown>();
const connected = createEvent<unknown>();

const $isOnline = createStore(isBrowser && window.navigator.onLine)
  .on(connectionLost, () => false)
  .on(connected, () => true);

export const internetConnectionModel = {
  connected,
  connectionLost,
  $isOnline,
};
