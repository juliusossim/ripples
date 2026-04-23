import type { Meta, StoryObj } from '@storybook/react-vite';
import { Caption } from './Typography';
import { expect } from 'storybook/test';

const meta = {
  component: Caption,
  title: 'Caption',
} satisfies Meta<typeof Caption>;
export default meta;

type Story = StoryObj<typeof Caption>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Caption/gi)).toBeTruthy();
  },
} satisfies Story;
