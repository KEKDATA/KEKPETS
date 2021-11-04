import { SearchResponse } from 'shared/typings/search';

import { createApiUrl, Paths, toJSON } from './lib';

export const search = (params: string): Promise<SearchResponse> =>
  fetch(
    createApiUrl({ path: Paths.Search, params: `format=json&${params}` }),
  ).then(toJSON);
