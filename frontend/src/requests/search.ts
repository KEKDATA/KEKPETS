import { SearchResponse } from 'shared/typings/search';

import { createApiUrl } from './lib/create_api_url';
import { Paths } from './lib/paths';
import { toJSON } from './lib/to_json';

export const search = (params: string): Promise<SearchResponse> =>
  fetch(
    createApiUrl({ path: Paths.Search, params: `format=json&${params}` }),
  ).then(toJSON);
