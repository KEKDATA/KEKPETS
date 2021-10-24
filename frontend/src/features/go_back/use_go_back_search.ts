import { useEffect } from 'react';

import { searchModel } from 'entity/search';

import { getSearchParams } from 'shared/lib/url/search_params';

/**
 * При клике по системной кнопке назад обрабатывается новый запрос
 * на основе актуальных параметров урла
 * Если параметров нет - ивент searchParamsNotFounded сигнализирует об этом
 * Параметров может не быть в текущей ситуации на поиске, только если поиск не начат
 */
export const useGoBackSearch = () => {
  useEffect(() => {
    const handleGoBack = () => {
      const searchParams = getSearchParams().toString();

      if (searchParams.length === 0) {
        return searchModel.searchParamsNotFounded();
      }

      searchModel.getSearchResultsFx(searchParams.toString());
    };

    window.addEventListener('popstate', handleGoBack);

    return () => {
      window.removeEventListener('popstate', handleGoBack);
    };
  }, []);
};
