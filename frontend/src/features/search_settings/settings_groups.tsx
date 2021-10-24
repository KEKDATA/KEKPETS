import { useStore } from 'effector-react';
import React, { memo } from 'react';

import Grid from '@mui/material/Grid';

import { animalTypeModel, AnimalTypeSelect } from 'entity/animal_type';
import { BreedAutocomplete, breedModel } from 'entity/breed';
import { ColorSelect, colorModel } from 'entity/color';
import { tailModel, TailSelect } from 'entity/tail';

/**
 * Набор параметров для управления поиском
 */
export const SettingsGroups = memo(
  () => {
    const colorValue = useStore(colorModel.$value);
    const breedValue = useStore(breedModel.$autoCompleteValue);
    const tailValue = useStore(tailModel.$value);
    const animalTypeValue = useStore(animalTypeModel.$value);

    return (
      <>
        <Grid item>
          <AnimalTypeSelect
            value={animalTypeValue}
            onChange={animalTypeModel.valueChanged}
          />
        </Grid>
        <Grid item>
          <ColorSelect value={colorValue} onChange={colorModel.valueChanged} />
        </Grid>
        <Grid item>
          <TailSelect value={tailValue} onChange={tailModel.valueChanged} />
        </Grid>
        <Grid container justifyContent="center">
          <BreedAutocomplete
            value={breedValue}
            onChange={breedModel.autoCompleteValueChanged}
          />
        </Grid>
      </>
    );
  },
  () => true,
);

SettingsGroups.displayName = 'SettingsGroups';
