import type { Meta, StoryObj } from '@storybook/react-vite';
import { H2 } from './Typography';
import { expect } from 'storybook/test';

const meta = {
  component: H2,
  title: 'H2',
} satisfies Meta<typeof H2>;
export default meta;

type Story = StoryObj<typeof H2>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/H2/gi)).toBeTruthy();
  },
} satisfies Story;
