import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormInput } from './FormInput';
import { expect } from 'storybook/test';

const meta = {
  component: FormInput,
  title: 'FormInput',
} satisfies Meta<typeof FormInput>;
export default meta;

type Story = StoryObj<typeof FormInput>;

export const Primary = {
  args: {
    name: '',
    label: '',
    description: '',
    required: false,
    className: '',
  },
} satisfies Story;

export const Heading = {
  args: {
    name: '',
    label: '',
    description: '',
    required: true,
    className: '',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/FormInput/gi)).toBeTruthy();
  },
} satisfies Story;
