import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { createGate } from 'effector-react';
import { condition } from 'patronum';
import { api } from 'requests/index';

import { getQueryString } from 'shared/lib/url/query_string';

import { Results } from 'shared/typings/results';

import { SearchSettingsFieldsKeys } from 'shared/constants/search_settings_fields/keys';

import { getFieldsKeysFromUrl } from './lib/fields_keys_from_url';
import { isSearchParamsExist } from './lib/is_search_params_exist';
import { requiredSettingsIncluded } from './lib/required_settings_included';
import { getSearchSettingsFields } from './lib/search_settings_fields';
import { SearchSettingsFormUrl } from './types';

const RESULTS_PER_PAGE = 50;

const SearchGate = createGate();

const searchParamsNotFounded = createEvent();

const getSearchResultsFx = createEffect(api.search);

const searchResultsReceived = getSearchResultsFx.doneData;

const countReceived = searchResultsReceived.map(response => response.count);

const resultsReceived = searchResultsReceived.map(response => response.results);

const $isError = createStore(false)
  .on(getSearchResultsFx.fail, () => true)
  .reset(getSearchResultsFx.done);

/**
 * Сущность содержащая параметры настроек серча указанных в урле
 */
const $searchSettingsFieldsFromUrl = createStore<null | SearchSettingsFormUrl>(
  null,
).on(
  [
    SearchGate.open,
    getSearchResultsFx.done,
    getSearchResultsFx.fail,
    searchParamsNotFounded,
  ],
  getSearchSettingsFields,
);

/**
 * По флоу работы с адресной строкой, в момент фетча запроса
 * мы уже имеем в адресной строке параметры поиска
 * Данное хранилище необходимо для отображения ui под выдачу результатов
 */
const $isSearchParamsExist = createStore(false)
  .on(searchParamsNotFounded, () => false)
  .on(getSearchResultsFx.pending, () => true);

const $count = createStore<null | number>(null)
  .on(countReceived, (_, count = RESULTS_PER_PAGE) =>
    Math.ceil(count / RESULTS_PER_PAGE),
  )
  .reset(searchParamsNotFounded);

const $results = createStore<Results | null>(null)
  .on(resultsReceived, (_, results) => results)
  .reset(searchParamsNotFounded);

const $resultsNotFound = $results.map(
  results => !results || results.length === 0,
);

const $isResultsWithSomeProblem = combine([$resultsNotFound, $isError]).map(
  values => values.includes(true),
);

/**
 * При открытии страницы поиска сработает данный ивент
 * Имеем два состояния ивента
 * Мы нашли обязательные параметры в урле
 * В урле не было обнаружено ожидаемых параметров
 */
const fieldsFromSearchParsed = sample({
  clock: SearchGate.open,
  fn: () => {
    const fieldsKeysFromUrl = getFieldsKeysFromUrl();
    const isRequiredSettingsIncluded = requiredSettingsIncluded({
      searchSettings: fieldsKeysFromUrl,
      requiredSettings: [SearchSettingsFieldsKeys.Type],
    });

    if (!isRequiredSettingsIncluded) {
      return '';
    }

    return getQueryString(fieldsKeysFromUrl);
  },
});

/**
 * Если мы нашли обязательные параметры, то выполняем запрос на получение результатов поиска
 * Если мы не нашли, то отработает логика по сценарию, который включает отмену запроса
 * и показ только формы настроек поиска, без выдачи результатов
 */
condition({
  source: fieldsFromSearchParsed,
  if: isSearchParamsExist,
  then: getSearchResultsFx,
  else: searchParamsNotFounded,
});

export const searchModel = {
  $isResultsWithSomeProblem,
  $isError,
  SearchGate,
  $searchSettingsFieldsFromUrl,
  $isSearchParamsExist,
  $count,
  $resultsNotFound,
  $results,
  countReceived,
  resultsReceived,
  getSearchResultsFx,
  searchParamsNotFounded,
};
