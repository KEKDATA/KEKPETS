import React from 'react';

import Grid from '@mui/material/Grid';

import { getButtonSize } from 'features/results/lib/button_size';
import { getIconSize } from 'features/results/lib/icon_size';
import { OpenImage } from 'features/results/ui/open_image';
import { SaveImage } from 'features/results/ui/save_image';

import { useIsMobile } from 'shared/lib/screen_type/is_mobile';
import { useFabColor } from 'shared/lib/theme/fab_color';

import { CopyButton } from 'shared/ui/copy_button';

interface Props {
  image: string;
}

export const ImageControls = ({ image }: Props) => {
  const fabColor = useFabColor();
  const isMobile = useIsMobile();

  const sizeButton = getButtonSize({ isMobile });
  const sizeIcon = getIconSize({ isMobile });

  return (
    <Grid container spacing={2}>
      <Grid item>
        <OpenImage
          image={image}
          fabColor={fabColor}
          sizeButton={sizeButton}
          sizeIcon={sizeIcon}
        />
      </Grid>
      <Grid item>
        <CopyButton
          textToCopy={image}
          label="Копировать ссылку на изображение"
          fabColor={fabColor}
          sizeButton={sizeButton}
          sizeIcon={sizeIcon}
        />
      </Grid>
      <Grid item>
        <SaveImage
          image={image}
          fabColor={fabColor}
          sizeButton={sizeButton}
          sizeIcon={sizeIcon}
        />
      </Grid>
    </Grid>
  );
};
