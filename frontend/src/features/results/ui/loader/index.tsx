import React from 'react';

import { styled } from '@mui/material/styles';

import { Loader } from 'shared/ui/loader';

const LoaderWrapper = styled('div')`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const ResultsLoader = () => {
  return (
    <LoaderWrapper>
      <Loader />
    </LoaderWrapper>
  );
};
