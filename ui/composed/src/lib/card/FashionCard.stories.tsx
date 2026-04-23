import type { Meta, StoryObj } from '@storybook/react-vite';
import { FashionCard } from './FashionCard';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { defaultProduct } from '../utils/mock';

const meta = {
  component: FashionCard,
  title: 'FashionCard',
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    product: defaultProduct,
  },
} satisfies Meta<typeof FashionCard>;
export default meta;

type Story = StoryObj<typeof FashionCard>;

export const Primary = {} satisfies Story;

export const Heading = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText(defaultProduct.name, { exact: false })
    ).toBeTruthy();
  },
} satisfies Story;
