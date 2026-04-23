import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormSelectItem } from './FormSelectItem';
import { expect } from 'storybook/test';

const meta = {
  component: FormSelectItem,
  title: 'FormSelectItem',
} satisfies Meta<typeof FormSelectItem>;
export default meta;

type Story = StoryObj<typeof FormSelectItem>;

export const Primary = {
  args: {
    item: '',
  },
} satisfies Story;

export const Heading = {
  args: {
    item: '',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/FormSelectItem/gi)).toBeTruthy();
  },
} satisfies Story;
