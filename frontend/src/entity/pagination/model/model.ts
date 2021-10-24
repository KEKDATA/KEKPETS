import { createEvent, forward, restore, sample } from 'effector';

import { searchModel } from 'entity/search';

import { isBrowser } from 'shared/lib/browser/is_browser';
import { scrollToTop } from 'shared/lib/scroll/to_top';
import { pushSearchParams } from 'shared/lib/url/push_search_params';
import { getSearchParams } from 'shared/lib/url/search_params';

import { PagesPaths } from 'shared/constants/pages_paths';

import { setupPageToSearchParams } from './lib/setup_page_to_search_params';

const defaultPage = 1;

const pageSelected = createEvent<number>();
const pageToSearchParamsSent = createEvent<number>();

/**
 * getSearchParams содержит DOM API, на момент рендера Gatsby работа с этим апи невозможна
 */
const initialState =
  (isBrowser && Number(getSearchParams().get('page'))) || defaultPage;
const $page = restore(pageSelected, initialState);

/**
 * Для консистенции с другими данными для поиска приводим к такому же типу - стринге
 */
const $pageForSearch = $page.map(String);

/**
 * Для более удобного разделения сущностей
 * Например, при тестировании
 */
forward({
  from: pageSelected,
  to: pageToSearchParamsSent,
});

/**
 * Работа ивента возможна при наличии DOM API
 * Выполнение ивента сигнализирует об успешной обработке серч параметров урла
 * после смены номера страницы
 */
const searchParamsReceived = sample({
  clock: pageToSearchParamsSent,
  fn: page => {
    if (!isBrowser) {
      return '';
    }

    const searchParams = getSearchParams();
    const withPage = setupPageToSearchParams(searchParams, page.toString());

    return withPage.toString();
  },
});

/**
 * С актуальными серч параметрами формируем запрос для получения новых результатов
 */
sample({
  clock: searchParamsReceived,
  target: searchModel.getSearchResultsFx,
});

/**
 * Сайд-эффекты для обновления:
 * серч параметров урла
 * скрола к топу страницы
 */
searchParamsReceived.watch(searchParams => {
  pushSearchParams({
    url: PagesPaths.Search,
    queryString: searchParams,
  });
  scrollToTop();
});

export const paginationModel = {
  pageSelected,
  $page,
  $pageForSearch,
};
