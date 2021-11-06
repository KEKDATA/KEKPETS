import React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import { Result } from 'shared/typings/results';

import { DateInfo } from '../date';
import { ImageControls } from '../image_controls';
import { MapLink } from '../map_link';
import { PolicePhones } from '../police_phones';

interface Props {
  image: Result['image'];
  date?: Result['date'];
  address?: Result['address'];
  ovdPhones: Result['ovd_phones'];
}

export const MainInfo = ({ date, address, image, ovdPhones }: Props) => {
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
          {ovdPhones.length > 0 && (
            <Grid item>
              <PolicePhones ovdPhones={ovdPhones} />
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
