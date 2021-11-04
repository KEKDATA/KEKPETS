import React from 'react';

import Box from '@mui/material/Box';
import MuiFormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';

import { SelectValues } from 'shared/typings/select';

interface Props {
  label: string;
  onChangeValue: (value: string) => void;
  items: SelectValues;
  value: string;
  isError?: boolean;
  isRequired?: boolean;
}

const FormControl = styled(MuiFormControl)(
  ({
    theme: {
      palette: { mode, common },
      shape: { borderRadius },
    },
  }) => ({
    backgroundColor: mode === 'dark' ? common.black : common.white,
    borderRadius,
    '& > div': {
      backgroundColor: mode === 'dark' ? common.black : common.white,
    },
  }),
);

export const Select = ({
  value,
  label,
  onChangeValue,
  items,
  isError,
  isRequired,
}: Props) => {
  const handleChange = (event: SelectChangeEvent) =>
    onChangeValue(event.target.value);

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl
        sx={{ m: 1, minWidth: 150 }}
        error={isError}
        variant="filled"
        required={isRequired}>
        <InputLabel id={label}>{label}</InputLabel>
        <MuiSelect
          labelId={label}
          value={value}
          label={label}
          onChange={handleChange}>
          <MenuItem value="">
            <em>Не выбрано</em>
          </MenuItem>
          {items.map(({ text, value }) => (
            <MenuItem key={value} value={value}>
              {text}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    </Box>
  );
};
