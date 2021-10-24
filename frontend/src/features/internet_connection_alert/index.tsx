import { useStore } from 'effector-react';
import React from 'react';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import {
  internetConnectionModel,
  useInternetConnectionListener,
} from 'entity/internet_connection';

export const InternetConnectionAlert = () => {
  useInternetConnectionListener();

  const isOnline = useStore(internetConnectionModel.$isOnline);

  return (
    <Snackbar open={!isOnline} autoHideDuration={6000}>
      <Alert severity="warning">
        Упс, что - то не так с интернетом, проверьте скорее!
      </Alert>
    </Snackbar>
  );
};
