import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './Typography';
import { expect } from 'storybook/test';

const meta = {
  component: Label,
  title: 'Label',
} satisfies Meta<typeof Label>;
export default meta;

type Story = StoryObj<typeof Label>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Label/gi)).toBeTruthy();
  },
} satisfies Story;
