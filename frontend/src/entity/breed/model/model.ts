import { createEvent, createStore, sample } from 'effector';

import { createSettingModel } from 'shared/lib/creators/setting_model';

import { searchSettingsOptionsMocks } from 'shared/mocks/search_settings_options';

import { SearchSettingsFieldsKeys } from 'shared/constants/search_settings_fields/keys';

const defaultValue = '';

const { $value, valueChanged } = createSettingModel({
  settingType: SearchSettingsFieldsKeys.Breed,
  defaultValue,
});

/**
 * @todo Пересмотреть подход к работе с данными в автокомплите
 */

const autoCompleteValueChanged = createEvent<string>();

const $autoCompleteValue = createStore<string | null>(null)
  .on(autoCompleteValueChanged, (_, value) => value)
  .on($value.updates, (prev, selectedValue) => {
    if (!selectedValue) {
      return null;
    }

    return searchSettingsOptionsMocks.breeds.find(
      ({ value }) => selectedValue === value,
    ).text;
  });

sample({
  clock: autoCompleteValueChanged,
  fn: value =>
    searchSettingsOptionsMocks.breeds.find(({ text }) => text === value)
      ?.value ?? defaultValue,
  target: valueChanged,
});

export const breedModel = {
  $value,
  valueChanged,
  autoCompleteValueChanged,
  $autoCompleteValue,
};
