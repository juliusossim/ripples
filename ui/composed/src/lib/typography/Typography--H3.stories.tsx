import type { Meta, StoryObj } from '@storybook/react-vite';
import { H3 } from './Typography';
import { expect } from 'storybook/test';

const meta = {
  component: H3,
  title: 'H3',
} satisfies Meta<typeof H3>;
export default meta;

type Story = StoryObj<typeof H3>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/H3/gi)).toBeTruthy();
  },
} satisfies Story;
