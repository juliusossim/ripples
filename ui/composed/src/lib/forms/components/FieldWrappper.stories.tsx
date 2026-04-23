import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldWrapper } from './FieldWrappper';
import { expect } from 'storybook/test';

const meta = {
  component: FieldWrapper,
  title: 'FieldWrapper',
} satisfies Meta<typeof FieldWrapper>;
export default meta;

type Story = StoryObj<typeof FieldWrapper>;

export const Primary = {
  args: {
    name: '',
    label: '',
    description: '',
    required: '',
    children: '',
  },
} satisfies Story;

export const Heading = {
  args: {
    name: '',
    label: '',
    description: '',
    required: '',
    children: '',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/FieldWrapper/gi)).toBeTruthy();
  },
} satisfies Story;
