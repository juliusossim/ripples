import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormTextarea } from './FormTextarea';
import { expect } from 'storybook/test';

const meta = {
  component: FormTextarea,
  title: 'FormTextarea',
} satisfies Meta<typeof FormTextarea>;
export default meta;

type Story = StoryObj<typeof FormTextarea>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/FormTextarea/gi)).toBeTruthy();
  },
} satisfies Story;
