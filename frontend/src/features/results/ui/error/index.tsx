import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import hiDogGif from './hi_dog.gif';

const Description = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.common.white
      : theme.palette.common.black,
}));

export const Error = () => {
  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center">
      <Grid item>
        <img src={hiDogGif} loading="lazy" alt="" />
      </Grid>
      <Grid item>
        <Description variant="h5">У нас что - то не так,</Description>
        <Description variant="h5">
          попробуйте еще раз через некоторое время
        </Description>
      </Grid>
    </Grid>
  );
};
