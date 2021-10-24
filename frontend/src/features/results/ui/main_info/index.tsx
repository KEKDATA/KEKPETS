import React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import { DateInfo } from '../date';
import { ImageControls } from '../image_controls';
import { MapLink } from '../map_link';

interface Props {
  image: string;
  date?: string;
  address?: string;
}

export const MainInfo = ({ date, address, image }: Props) => {
  return (
    <>
      <Box mb={1}>
        <Grid container flexDirection="column">
          {date && (
            <Grid item sx={{ maxHeight: 35 }}>
              <Box ml={0.8}>
                <DateInfo date={date} />
              </Box>
            </Grid>
          )}
          {address && (
            <Grid item>
              <MapLink address={address} />
            </Grid>
          )}
        </Grid>
      </Box>
      <Divider />
      <Box ml={0.5} mt={2}>
        <ImageControls image={image} />
      </Box>
    </>
  );
};
