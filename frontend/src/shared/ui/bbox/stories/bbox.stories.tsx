import '@storybook/addon-controls';
import { Story } from '@storybook/react';
import React from 'react';

import { BBox, BBoxProps } from 'shared/ui/bbox';
import { BBoxContainer } from 'shared/ui/bbox_container';
import { ImageView } from 'shared/ui/image_view';

export default {
  title: 'BBox',
  argTypes: {
    left: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
    top: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
    width: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
    height: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
  },
};

const Template: Story<
  BBoxProps & { left: number; top: number; width: number; height: number }
> = ({ left, top, width, height }) => {
  return (
    <BBoxContainer>
      <ImageView url="https://media.istockphoto.com/photos/cat-is-looking-at-food-cat-watches-over-the-food-sly-beautiful-gray-picture-id1069968848" />
      <BBox
        coordinates={[
          left.toString(),
          top.toString(),
          width.toString(),
          height.toString(),
        ].join(',')}
      />
    </BBoxContainer>
  );
};

export const Default = Template.bind({});

Default.args = {
  left: 0.1,
  top: 0.1,
  width: 0.2,
  height: 0.2,
};
