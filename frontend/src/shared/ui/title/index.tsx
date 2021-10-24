import React from 'react';

import Typography from '@mui/material/Typography';

interface Props {
  text: string;
}

export const Title = ({ text }: Props) => {
  return (
    <Typography variant="h5" component="h1" gutterBottom align="center">
      {text}
    </Typography>
  );
};
