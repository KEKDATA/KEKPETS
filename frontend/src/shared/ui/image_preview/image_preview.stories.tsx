import React, { useState } from 'react';

import Box from '@mui/material/Box';

import { PetView } from 'features/results/ui/pet_view';

import { ImagePreview } from 'shared/ui/image_preview/index';

export default {
  component: ImagePreview,
  title: 'ImagePreview',
  argTypes: {
    isImageLoaded: {
      control: {
        type: 'boolean',
      },
    },
  },
};

interface Args {
  isImageLoaded: boolean;
}

export const Default = (args: Args) => {
  const [open, setOpen] = useState(false);

  const Pet = (
    <PetView
      image="https://media.istockphoto.com/photos/cat-is-looking-at-food-cat-watches-over-the-food-sly-beautiful-gray-picture-id1069968848"
      bbox="0.2,0.2,0.2,0.2"
      {...args}
    />
  );

  return (
    <>
      <Box
        sx={{ cursor: 'zoom-in', display: 'inline-flex' }}
        onClick={() => setOpen(true)}>
        {Pet}
      </Box>
      <ImagePreview open={open} onClose={() => setOpen(false)}>
        {Pet}
      </ImagePreview>
    </>
  );
};

Default.args = {
  isImageLoaded: true,
};
