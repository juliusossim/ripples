import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSpinner } from './loading-spinner';
import { expect } from 'storybook/test';

const meta = {
  component: LoadingSpinner,
  title: 'LoadingSpinner',
} satisfies Meta<typeof LoadingSpinner>;
export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const Primary = {
  args: {
    title: 'Please Wait...',
    message: 'Fetching data',
    imageUrl:
      'https://graphicsfamily.com/wp-content/uploads/edd/2019/01/free-creative-logo-template.jpg',
  },
} satisfies Story;

export const Heading = {
  args: {
    title: 'LoadingSpinner',
    message: 'LoadingSpinner',
    imageUrl:
      'https://graphicsfamily.com/wp-content/uploads/edd/2019/01/free-creative-logo-template.jpg',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/LoadingSpinner/gi)).toBeTruthy();
  },
} satisfies Story;
