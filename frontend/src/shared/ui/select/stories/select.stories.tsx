import React, { useState } from 'react';

import { Select } from '../index';

export default {
  component: Select,
  title: 'Select',
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    isError: {
      control: {
        type: 'boolean',
      },
    },
    isRequired: {
      control: {
        type: 'boolean',
      },
    },
  },
};

interface Args {
  label: string;
  isError: boolean;
  isRequired: boolean;
}

const items = [
  {
    text: 'Item 1',
    value: 'a',
  },
  {
    text: 'Item 2',
    value: 'b',
  },
  {
    text: 'Item 3',
    value: 'c',
  },
];

export const Default = (args: Args) => {
  const [value, setValue] = useState('');

  return (
    <Select {...args} items={items} value={value} onChangeValue={setValue} />
  );
};

Default.args = {
  label: 'Label',
  isError: false,
  isRequired: false,
};
