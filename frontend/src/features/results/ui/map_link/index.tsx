import React from 'react';

import RoomIcon from '@mui/icons-material/Room';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { getGoogleMapLink } from 'shared/lib/map_link/google';

interface Props {
  address: string;
}

const StyledLink = styled(Link)(({ theme }) => ({
  margin: theme.spacing(0.7),
  display: 'flex',
  width: 'max-content',
}));

const Address = styled(Typography)(({ theme }) => ({
  marginLeft: 10,
  maxWidth: 300,
  [theme.breakpoints.up('sm')]: {
    maxWidth: 450,
  },
}));

export const MapLink = ({ address }: Props) => {
  return (
    <StyledLink
      target="_blank"
      rel="noopener noreferrer"
      href={getGoogleMapLink(address)}>
      <RoomIcon />
      <Address title={address}>{address}</Address>
    </StyledLink>
  );
};
