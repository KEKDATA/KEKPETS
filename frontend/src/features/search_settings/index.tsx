import { useStore } from 'effector-react';
import React from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

import { searchModel } from 'entity/search';

import { AnimatedDog } from 'shared/ui/animated_dog';

import { model } from './model';
import { SettingsGroups } from './settings_groups';
import { Submit } from './ui/submit';

const SettingsContainer = styled(Grid)(({ theme }) => ({
  height: '100vh',
  transition: 'height 0.2s ease-out',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.common.black : blue[200],
  '&[data-search-params-exist="true"]': {
    height: 370,
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      height: 250,
      paddingBottom: 0,
    },
  },
}));

const DogContainer = styled('div')`
  position: relative;
  margin: -160px 0 -60px 0;
`;

export const SearchSettings = () => {
  const isSearchParamsExist = useStore(searchModel.$isSearchParamsExist);
  const isDisabledForm = useStore(model.$isDisabledForm);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    model.formSubmitted();
  };

  return (
    <SettingsContainer
      container
      flexDirection="column"
      alignItems="center"
      justifyContent={{
        xs: isSearchParamsExist ? 'flex-end' : 'center',
        sm: 'center',
      }}
      alignContent="center"
      data-search-params-exist={isSearchParamsExist}>
      {!isSearchParamsExist && (
        <DogContainer>
          <AnimatedDog />
        </DogContainer>
      )}
      <Container maxWidth="lg">
        <form onSubmit={handleSubmit}>
          <Grid
            container
            rowSpacing={{ xs: 0.2, sm: 1 }}
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ sm: 'center ' }}
            justifyContent={{ sm: 'center ' }}>
            <SettingsGroups />
            <Grid item>
              <Submit isDisabled={isDisabledForm} />
            </Grid>
          </Grid>
        </form>
      </Container>
    </SettingsContainer>
  );
};
