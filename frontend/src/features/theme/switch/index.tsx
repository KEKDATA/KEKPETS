import { useStore } from 'effector-react';
import React from 'react';

import { styled } from '@mui/material/styles';

import { colorSchemeModeModel } from '../model';
import dayBackground from './img/day_background_square.svg';
import nightBackground from './img/night_background_square.svg';
import nightMark from './img/night_mark.svg';
import smile from './img/smile.jpg';

const swithToLightLabel = 'Переключить на светлую тему';
const switchToDarkLabel = 'Переключить на темную тему';

const Container = styled('div')(({ theme }) => ({
  zIndex: 1,
  position: 'absolute',
  width: 32,
  height: 32,
  borderRadius: '10px',
  right: 20,
  top: 20,
  backgroundImage: `url(${
    theme.palette.mode === 'dark' ? nightBackground : dayBackground
  })`,
  overflow: 'hidden',
  cursor: 'pointer',
  userSelect: 'none',
}));

const Icon = styled('div')`
  width: 20px;
  height: 20px;
  position: absolute;
  visibility: hidden;

  background-position: 50%;
  background-size: cover;

  transition: transform 1s;
`;

const LightIcon = styled(Icon)`
  border-radius: 50%;
  box-shadow: 0 0 5px rgb(0 0 0 / 25%), inset 0 0 10px hsl(0deg 0% 100% / 50%);
  background-image: url(${smile});
  transform: translate3d(-20px, 40px, 0);

  &[data-show='true'] {
    visibility: visible;
    transform: translate3d(0, 12px, 6px);
  }
`;

const DarkIcon = styled(Icon)`
  background-image: url(${nightMark});
  transform: translate3d(30px, 35px, 0);

  &[data-show='true'] {
    visibility: visible;
    transform: translate3d(12px, 12px, 0);
  }
`;

export const ThemeSwitch = () => {
  const isDark = useStore(colorSchemeModeModel.$isDarkTheme);

  const label = isDark ? swithToLightLabel : switchToDarkLabel;

  return (
    <Container
      aria-label={label}
      onClick={colorSchemeModeModel.darkThemeToggled}>
      <DarkIcon data-show={isDark} />
      <LightIcon data-show={!isDark} />
    </Container>
  );
};
