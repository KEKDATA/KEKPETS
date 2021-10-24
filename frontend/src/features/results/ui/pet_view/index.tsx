import React from 'react';

import MuiSkeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

import { BBox } from 'shared/ui/bbox';
import { BBoxContainer } from 'shared/ui/bbox_container';
import { ImageView } from 'shared/ui/image_view';

interface Props {
  image: string;
  bbox: string;
  isImageLoaded: boolean;
  width?: number | string;
}

const Skeleton = styled(MuiSkeleton)(({ theme }) => ({
  height: 200,
  [theme.breakpoints.up('sm')]: {
    width: 500,
    height: 300,
  },
}));

export const PetView = ({ image, bbox, width, isImageLoaded }: Props) => {
  return (
    <>
      {isImageLoaded && (
        <BBoxContainer>
          <ImageView url={image} loading="lazy" width={width} />
          <BBox coordinates={bbox} />
        </BBoxContainer>
      )}
      {!isImageLoaded && <Skeleton variant="rectangular" animation="wave" />}
    </>
  );
};
