import { createEvent, createStore } from 'effector';

const darkThemeToggled = createEvent<unknown>();

const $isDarkTheme = createStore(false).on(darkThemeToggled, prev => !prev);

export const colorSchemeModeModel = {
  darkThemeToggled,
  $isDarkTheme,
};
