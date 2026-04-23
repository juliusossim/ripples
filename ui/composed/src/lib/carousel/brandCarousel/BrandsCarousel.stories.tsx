import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandsCarousel } from './BrandsCarousel';
import { expect } from 'storybook/test';

const meta = {
  component: BrandsCarousel,
  title: 'BrandsCarousel',
} satisfies Meta<typeof BrandsCarousel>;
export default meta;

type Story = StoryObj<typeof BrandsCarousel>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/BrandsCarousel/gi)).toBeTruthy();
  },
} satisfies Story;
