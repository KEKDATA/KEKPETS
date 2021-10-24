import React from 'react';

import { Title } from '../index';

export default {
  component: Title,
  title: 'Title',
  argTypes: {
    text: {
      control: {
        type: 'string',
      },
    },
  },
};

interface Args {
  text: string;
}

export const Default = (args: Args) => <Title {...args} />;

Default.args = {
  text: 'Title',
};
