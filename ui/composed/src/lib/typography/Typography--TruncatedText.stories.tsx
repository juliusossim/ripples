import type { Meta, StoryObj } from '@storybook/react-vite';
import { TruncatedText } from './Typography';
import { expect } from 'storybook/test';

const meta = {
  component: TruncatedText,
  title: 'TruncatedText',
} satisfies Meta<typeof TruncatedText>;
export default meta;

type Story = StoryObj<typeof TruncatedText>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/TruncatedText/gi)).toBeTruthy();
  },
} satisfies Story;
