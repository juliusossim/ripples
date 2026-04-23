import type { Meta, StoryObj } from '@storybook/react-vite';
import { SmallText } from './Typography';
import { expect } from 'storybook/test';

const meta = {
  component: SmallText,
  title: 'SmallText',
} satisfies Meta<typeof SmallText>;
export default meta;

type Story = StoryObj<typeof SmallText>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/SmallText/gi)).toBeTruthy();
  },
} satisfies Story;
