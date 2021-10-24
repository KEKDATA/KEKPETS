import React, { FC } from 'react';

import { ThemeProvider } from './provider';
import { ThemeSwitch } from './switch';

export const Theme: FC = ({ children }) => {
  return (
    <ThemeProvider>
      <ThemeSwitch />
      {children}
    </ThemeProvider>
  );
};
