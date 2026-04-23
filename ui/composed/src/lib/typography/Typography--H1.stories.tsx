import type { Meta, StoryObj } from '@storybook/react-vite';
import { H1 } from './Typography';
import { expect } from 'storybook/test';

const meta = {
  component: H1,
  title: 'H1',
} satisfies Meta<typeof H1>;
export default meta;

type Story = StoryObj<typeof H1>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/H1/gi)).toBeTruthy();
  },
} satisfies Story;
