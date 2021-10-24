import { useEffect } from 'react';

import { isBrowser } from 'shared/lib/browser/is_browser';

import { internetConnectionModel } from './index';

export const useInternetConnectionListener = () => {
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    window.addEventListener('online', internetConnectionModel.connected);
    window.addEventListener('offline', internetConnectionModel.connectionLost);

    return () => {
      window.removeEventListener('online', internetConnectionModel.connected);
      window.removeEventListener(
        'offline',
        internetConnectionModel.connectionLost,
      );
    };
  }, []);
};
