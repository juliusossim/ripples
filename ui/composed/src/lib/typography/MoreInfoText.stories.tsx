import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreInfoText } from './MoreInfoText';
import { expect } from 'storybook/test';

const meta = {
  component: MoreInfoText,
  title: 'MoreInfoText',
} satisfies Meta<typeof MoreInfoText>;
export default meta;

type Story = StoryObj<typeof MoreInfoText>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/MoreInfoText/gi)).toBeTruthy();
  },
} satisfies Story;
