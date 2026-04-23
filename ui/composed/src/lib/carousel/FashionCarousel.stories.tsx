import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { defaultProduct } from '../utils/mock';
import { ProductCarousel } from './productCarousel/ProductCarousel';

const meta = {
  component: ProductCarousel,
  title: 'FashionCarousel',
} satisfies Meta<typeof ProductCarousel>;
export default meta;

type Story = StoryObj<typeof ProductCarousel>;

export const Primary = {
  args: { product: defaultProduct },
} satisfies Story;

export const Heading = {
  args: { product: defaultProduct },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/FashionCarousel/gi)).toBeTruthy();
  },
} satisfies Story;
