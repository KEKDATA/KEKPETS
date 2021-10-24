import React from 'react';

import ImageIcon from '@mui/icons-material/Image';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

interface Props {
  image: string;
  fabColor: 'default' | 'primary';
  sizeButton: 'small' | 'medium';
  sizeIcon: 'small' | 'medium';
}

export const OpenImage = ({ image, fabColor, sizeButton, sizeIcon }: Props) => {
  return (
    <Tooltip title="Открыть изображение в новой вкладке">
      <Fab
        color={fabColor}
        aria-label="Открыть изображение в новой вкладке"
        target="_blank"
        href={image}
        size={sizeButton}>
        <ImageIcon fontSize={sizeIcon} />
      </Fab>
    </Tooltip>
  );
};
