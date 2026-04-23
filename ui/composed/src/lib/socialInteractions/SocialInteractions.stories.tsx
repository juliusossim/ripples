import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { SocialInteractions } from './SocialInteractions';

const meta = {
  component: SocialInteractions,
  title: 'SocialInteractions',
} satisfies Meta<typeof SocialInteractions>;
export default meta;

type Story = StoryObj<typeof SocialInteractions>;

export const Primary = {
  args: {
    productId: 'product-123',
  },
} satisfies Story;

export const Heading = {
  args: {
    productId: 'product-456',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toBeTruthy();
  },
} satisfies Story;
