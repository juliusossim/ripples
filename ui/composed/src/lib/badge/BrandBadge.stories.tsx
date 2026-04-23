import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandBadge } from './BrandBadge';
import { expect } from 'storybook/test';
import { defaultBrands } from '../utils/mock';

const meta = {
  component: BrandBadge,
  title: 'BrandBadge',
} satisfies Meta<typeof BrandBadge>;
export default meta;

type Story = StoryObj<typeof BrandBadge>;

export const Primary = {
  args: { brand: defaultBrands[0] },
} satisfies Story;

export const Heading = {
  args: { brand: defaultBrands[0] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/BrandBadge/gi)).toBeTruthy();
  },
} satisfies Story;
