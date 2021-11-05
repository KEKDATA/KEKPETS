import { combine, createEvent, sample } from 'effector';

import { animalTypeModel } from 'entity/animal_type';
import { breedModel } from 'entity/breed';
import { colorModel } from 'entity/color';
import { searchModel } from 'entity/search';
import { tailModel } from 'entity/tail';

import { pushSearchParams } from 'shared/lib/url/push_search_params';

import { PagesPaths } from 'shared/constants/pages_paths';
import { SearchSettingsFieldsKeys } from 'shared/constants/search_settings_fields/keys';

import { getQueryBySelectedSettings } from './lib/get_query_by_selected_settings';
import { isSettingExist } from './lib/is_setting_exist';

const DEFAULT_PAGE = '1';

const formSubmitted = createEvent();

/**
 * В случае если один из обязательный поле для заполнения не заполнен,
 * то на уровне ui дизейблим форму поиска
 */
const $isDisabledForm = combine({
  type: animalTypeModel.$value,
}).map(
  requiredSettings => !Object.values(requiredSettings).every(isSettingExist),
);

/**
 * Собираем в единую сущность значения элементов формы поиска
 * Для последующих операций, например, с апи при сабмите формы
 * При поиске мы всегда используем page = 1
 */
const $settingsQueryString = combine({
  [SearchSettingsFieldsKeys.Type]: animalTypeModel.$value,
  [SearchSettingsFieldsKeys.Tail]: tailModel.$value,
  [SearchSettingsFieldsKeys.Color]: colorModel.$value,
  [SearchSettingsFieldsKeys.Breed]: breedModel.$value,
}).map(params => getQueryBySelectedSettings({ ...params, page: DEFAULT_PAGE }));

/**
 * Обновляем урл поиска после сабмита формы
 * с актуальными значениями выбранными пользователем
 */
sample({
  source: $settingsQueryString,
  clock: formSubmitted,
  fn: settingsQueryString => {
    pushSearchParams({
      url: PagesPaths.Search,
      queryString: settingsQueryString,
    });
  },
});

/**
 * При сабмите формы выполняем запрос с параметрами поиска выбранными пользователем
 */
sample({
  source: $settingsQueryString,
  clock: formSubmitted,
  target: searchModel.getSearchResultsFx,
});

export const model = {
  formSubmitted,
  $isDisabledForm,
  $settingsQueryString,
};
