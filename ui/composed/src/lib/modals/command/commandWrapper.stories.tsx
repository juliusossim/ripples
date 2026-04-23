import type { Meta, StoryObj } from '@storybook/react-vite';
import { CommandWrapper } from '../commandWrapper';
import { expect } from 'storybook/test';

const meta = {
  component: CommandWrapper,
  title: 'CommandWrapper',
} satisfies Meta<typeof CommandWrapper>;
export default meta;

type Story = StoryObj<typeof CommandWrapper>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/CommandWrapper/gi)).toBeTruthy();
  },
} satisfies Story;
