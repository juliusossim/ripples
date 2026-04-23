import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ErrorMessage } from './error-message';

const meta = {
  component: ErrorMessage,
  title: 'ErrorMessage',
  argTypes: {
    onRetry: { action: 'onRetry executed!' },
    goBack: { action: 'goBack executed!' },
  },
} satisfies Meta<typeof ErrorMessage>;
export default meta;

type Story = StoryObj<typeof ErrorMessage>;

export const Primary = {
  args: {
    message: 'Something went wrong. Please try again later.',
  },
} satisfies Story;

export const Heading = {
  args: {
    message: 'An error occurred while loading data.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/error/gi)).toBeTruthy();
  },
} satisfies Story;
