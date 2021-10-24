import { useStore } from 'effector-react';
import React, { useMemo } from 'react';

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { searchModel } from 'entity/search';

import { Result } from './result';
import { Error } from './ui/error';
import { ResultsLoader } from './ui/loader';
import { NotFound } from './ui/not_found';

const ResultsContainer = styled('div')`
  position: relative;
  min-height: 80vh;
  justify-content: center;
  display: flex;
`;

export const Results = () => {
  const results = useStore(searchModel.$results);
  const resultsNotFound = useStore(searchModel.$resultsNotFound);
  const isFetching = useStore(searchModel.getSearchResultsFx.pending);
  const isSearchParamsExist = useStore(searchModel.$isSearchParamsExist);
  const isError = useStore(searchModel.$isError);

  const Content = useMemo(() => {
    switch (true) {
      case isError: {
        return <Error />;
      }

      case isFetching: {
        return <ResultsLoader />;
      }

      case resultsNotFound: {
        return <NotFound />;
      }

      default: {
        return (
          <Box sx={{ mt: 4 }}>
            <Grid
              rowSpacing={3}
              container
              flexDirection="column"
              justifyContent="center"
              alignContent="center"
              flexWrap="wrap">
              {results.map(result => (
                <Result key={result.id} result={result} />
              ))}
            </Grid>
          </Box>
        );
      }
    }
  }, [isError, isFetching, resultsNotFound]);

  if (!isSearchParamsExist) {
    return null;
  }

  return <ResultsContainer>{Content}</ResultsContainer>;
};
