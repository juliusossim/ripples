import type { Meta, StoryObj } from '@storybook/react-vite';
import { timezones } from './formMocks';
import { expect } from 'storybook/test';

const meta = {
  component: timezones,
  title: 'timezones',
} satisfies Meta<typeof timezones>;
export default meta;

type Story = StoryObj<typeof timezones>;

export const Primary = {
  args: {},
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/timezones/gi)).toBeTruthy();
  },
} satisfies Story;
