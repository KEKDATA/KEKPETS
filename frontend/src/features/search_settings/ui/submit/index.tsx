import { useStore } from 'effector-react';
import React from 'react';

import PetsIcon from '@mui/icons-material/Pets';
import MuiButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

interface Props {
  isDisabled: boolean;
}

const Button = styled(MuiButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  minHeight: 54,
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    opacity: 0.9,
  },
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.common.white,
  marginTop: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    marginTop: 0,
  },
}));

export const Submit = ({ isDisabled }: Props) => {
  const theme = useTheme();

  return (
    <Button
      fullWidth
      type="submit"
      variant="contained"
      size="large"
      disabled={isDisabled}
      endIcon={<PetsIcon sx={{ marginTop: '-5px' }} />}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: theme.typography.fontWeightBold }}>
        Найти питомца
      </Typography>
    </Button>
  );
};
