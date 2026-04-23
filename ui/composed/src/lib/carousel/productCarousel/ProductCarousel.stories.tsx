import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductCarousel } from './ProductCarousel';
import { expect } from 'storybook/test';

const meta = {
  component: ProductCarousel,
  title: 'ProductCarousel',
} satisfies Meta<typeof ProductCarousel>;
export default meta;

type Story = StoryObj<typeof ProductCarousel>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/ProductCarousel/gi)).toBeTruthy();
  },
} satisfies Story;
