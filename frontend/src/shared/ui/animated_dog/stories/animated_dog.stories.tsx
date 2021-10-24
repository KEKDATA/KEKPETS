import React from 'react';

import { AnimatedDog } from '../index';

export default {
  component: AnimatedDog,
  title: 'Animated Dog',
};

export const Default = () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
    <AnimatedDog />
  </div>
);
