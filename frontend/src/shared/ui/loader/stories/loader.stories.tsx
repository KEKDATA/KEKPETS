import React from 'react';

import { Loader } from '../index';

export default {
  component: Loader,
  title: 'Loader',
};

export const Default = () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
    <Loader />
  </div>
);
