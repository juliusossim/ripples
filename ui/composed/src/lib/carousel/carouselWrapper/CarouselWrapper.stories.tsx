import type { Meta, StoryObj } from '@storybook/react-vite';
import { CarouselWrapper } from './CarouselWrapper';
import { expect } from 'storybook/test';

const meta = {
  component: CarouselWrapper,
  title: 'CarouselWrapper',
} satisfies Meta<typeof CarouselWrapper>;
export default meta;

type Story = StoryObj<typeof CarouselWrapper>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/CarouselWrapper/gi)).toBeTruthy();
  },
} satisfies Story;
