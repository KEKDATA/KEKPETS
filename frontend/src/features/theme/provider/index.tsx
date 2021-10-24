import { useStore } from 'effector-react';
import React, { FC, useMemo } from 'react';

import { grey, lightBlue, orange } from '@mui/material/colors';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';

import { colorSchemeModeModel } from '../model';

export const ThemeProvider: FC = ({ children }) => {
  const isDarkMode = useStore(colorSchemeModeModel.$isDarkTheme);

  const theme = useMemo(() => {
    return createTheme({
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: `${
                isDarkMode ? grey[900] : lightBlue[50]
              } !important`,
              minHeight: '100vh',
            },
          },
        },
      },
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        secondary: {
          main: orange[800],
        },
        common: {
          black: grey[900],
        },
      },
    });
  }, [isDarkMode]);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
