import { useStore } from 'effector-react';
import React from 'react';

import { paginationModel, SearchPagination } from 'entity/pagination';
import { searchModel } from 'entity/search';

export const Pagination = () => {
  const paginationCount = useStore(searchModel.$count);
  const page = useStore(paginationModel.$page);
  const isResultsWithSomeProblem = useStore(
    searchModel.$isResultsWithSomeProblem,
  );

  if (!paginationCount || isResultsWithSomeProblem) {
    return null;
  }

  return (
    <SearchPagination
      paginationCount={paginationCount}
      page={page}
      onChange={paginationModel.pageSelected}
    />
  );
};
