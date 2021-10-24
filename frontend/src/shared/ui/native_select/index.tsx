import React from 'react';

import Box from '@mui/material/Box';
import MuiFormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MuiNativeSelect from '@mui/material/NativeSelect';
import { styled } from '@mui/material/styles';

import { SelectValues } from 'shared/typings/select';

interface Props {
  label: string;
  onChangeValue: (value: string) => void;
  items: SelectValues;
  value: string;
  borderRadius?: string;
  isError?: boolean;
  isRequired?: boolean;
}

const FormControl = styled(MuiFormControl)(
  ({
    theme: {
      palette: { mode, common },
    },
  }) => ({
    backgroundColor: mode === 'dark' ? common.black : common.white,
  }),
);

const notSelectedValue = 'not_selected';

export const NativeSelect = ({
  value,
  label,
  items,
  onChangeValue,
  borderRadius,
  isError,
  isRequired,
}: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const currentValue = value === notSelectedValue ? '' : value;

    onChangeValue(currentValue);
  };

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl
        fullWidth
        error={isError}
        required={isRequired}
        sx={{ borderRadius }}>
        <InputLabel
          variant="standard"
          htmlFor={label}
          sx={{ paddingLeft: 1.5, paddingTop: 0.8 }}>
          {label}
        </InputLabel>
        <MuiNativeSelect
          sx={{
            paddingLeft: 1,
          }}
          inputProps={{
            name: label,
            id: label,
          }}
          value={value || notSelectedValue}
          onChange={handleChange}>
          <option value={notSelectedValue}>Не выбрано</option>
          {items.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </MuiNativeSelect>
      </FormControl>
    </Box>
  );
};
