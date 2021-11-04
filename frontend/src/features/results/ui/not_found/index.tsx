import { withPrefix } from 'gatsby';
import React from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import sadDog from './sad_bubz.jpg';

const Description = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.common.white
      : theme.palette.common.black,
}));

export const NotFound = () => {
  return (
    <Grid
      container
      justifyContent="center"
      flexDirection="column"
      alignItems="center">
      <Grid item>
        <img src={sadDog} loading="lazy" alt="Грустный попугай" />
      </Grid>
      <Grid item>
        <Description variant="h5" align="center" gutterBottom>
          Результатов по вашему поиску не обнаружено
        </Description>
      </Grid>
      <Grid item>
        <Button variant="contained" href={withPrefix('/')}>
          Давай попробуем еще раз
        </Button>
      </Grid>
    </Grid>
  );
};
