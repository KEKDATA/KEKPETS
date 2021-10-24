import React, { FC, VFC } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Close } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  ButtonBase,
  ButtonProps,
  ClickAwayListener,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/system/colorManipulator';

const CLoseButton: VFC<ButtonProps> = props => {
  const { sx, ...rest } = props;

  return (
    <ButtonBase
      disableRipple
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        color: 'white',
        padding: 3,
        opacity: 0.7,

        '&:hover': {
          opacity: 1,
          background: alpha('rgba(0, 0, 0)', 0.5),
        },
        ...sx,
      }}
      {...rest}>
      <Close fontSize="large" />
    </ButtonBase>
  );
};

export interface ImagePreviewProps {
  open: boolean;
  onClose: () => void;
}

export const ImagePreview: FC<ImagePreviewProps> = props => {
  const { open, onClose, children } = props;
  const theme = useTheme();

  return (
    <Backdrop
      sx={{ zIndex: theme.zIndex.modal }}
      open={open}
      mountOnEnter
      unmountOnExit>
      <CLoseButton onClick={onClose} />

      <TransformWrapper centerOnInit>
        <TransformComponent
          wrapperStyle={{
            maxWidth: '100vw',
            maxHeight: '100vh',
          }}
          contentStyle={{
            width: '100vw',
            height: '100vh',
          }}>
          <ClickAwayListener onClickAway={onClose}>
            <Box
              sx={{
                margin: 'auto',
                '& img': { maxWidth: '100vw', maxHeight: '100vh' },
              }}>
              {children}
            </Box>
          </ClickAwayListener>
        </TransformComponent>
      </TransformWrapper>
    </Backdrop>
  );
};
