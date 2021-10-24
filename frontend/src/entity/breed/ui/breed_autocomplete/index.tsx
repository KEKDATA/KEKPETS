import React, { useState } from 'react';

import MuiAutocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

import { searchSettingsOptionsMocks } from 'shared/mocks/search_settings_options';

import { SearchSettingsFieldsTranslates } from 'shared/constants/search_settings_fields/translates';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const normalizedOptions = searchSettingsOptionsMocks.breeds.map(
  ({ text }) => text,
);

const Autocomplete = styled(MuiAutocomplete)(
  ({
    theme: {
      breakpoints,
      spacing,
      shape: { borderRadius },
      palette: { mode, common },
    },
  }) => ({
    marginTop: spacing(0.2),
    borderRadius,
    backgroundColor: mode === 'dark' ? common.black : common.white,
    width: '100%',
    [breakpoints.up('sm')]: {
      width: 482,
    },
  }),
);

const TextField = styled(MuiTextField)(
  ({
    theme: {
      palette: { mode, common },
    },
  }) => ({
    '& .MuiFilledInput-root': {
      background: mode === 'dark' ? common.black : common.white,
    },
  }),
);

export const BreedAutocomplete = ({ value, onChange }: Props) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue: string | null) => {
        onChange(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={normalizedOptions}
      renderInput={params => (
        <TextField
          {...params}
          variant="filled"
          label={SearchSettingsFieldsTranslates.Breed}
          color="primary"
        />
      )}
    />
  );
};
