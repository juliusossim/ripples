import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductGrid } from './product-grid';
import { expect } from 'storybook/test';

const meta = {
  component: ProductGrid,
  title: 'ProductGrid',
  argTypes: {
    onProductSelect: { action: 'onProductSelect executed!' },
  },
} satisfies Meta<typeof ProductGrid>;
export default meta;

type Story = StoryObj<typeof ProductGrid>;

export const Primary = {
  args: {
    products: '',
  },
} satisfies Story;

export const Heading = {
  args: {
    products: '',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/ProductGrid/gi)).toBeTruthy();
  },
} satisfies Story;
