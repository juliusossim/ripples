import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormSearchableSelect } from './index';
import { expect } from 'storybook/test';
import { FormProvider, useForm } from 'react-hook-form';
import { timezones } from '../../../utils/formMocks';

const meta = {
  component: FormSearchableSelect,
  title: 'FormSearchableSelect',
  decorators: [
    (Story) => {
      const form = useForm({
        defaultValues: [],
      });
      return (
        <FormProvider {...form}>
          <Story />
        </FormProvider>
      );
    },
  ],
} satisfies Meta<typeof FormSearchableSelect>;
export default meta;

type Story = StoryObj<typeof FormSearchableSelect>;

export const Primary = {
  args: {
    name: 'FormSearchableSelect',
    label: 'Form Searchable Select',
    description: 'This is a searchable select component',
    options: timezones[0].items,
    placeholder: 'Select an option',
    emptyText: 'No options found',
    popup: false,
    highlight: true,
    showClear: true,
    disabled: false,
    required: false,
    multiple: true,
    grouped: false,
  },
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/FormSearchableSelect/gi)).toBeTruthy();
  },
} satisfies Story;
