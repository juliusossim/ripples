import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Typography';
import { expect } from 'storybook/test';

const meta = {
  component: Text,
  title: 'Text',
} satisfies Meta<typeof Text>;
export default meta;

type Story = StoryObj<typeof Text>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Text/gi)).toBeTruthy();
  },
} satisfies Story;
