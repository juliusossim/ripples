import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { timezones } from '../../../utils/formMocks';
import { FormSelectSearchableMultiple } from './FormSelectSearchableMultiple';

const meta = {
  component: FormSelectSearchableMultiple,
  title: 'FormSelectSearchableMultiple',
  decorators: [
    (Story) => {
      const form = useForm({
        defaultValues: {
          timezones: [],
        },
      });
      return (
        <FormProvider {...form}>
          <Story />
        </FormProvider>
      );
    },
  ],
} satisfies Meta<typeof FormSelectSearchableMultiple>;
export default meta;

type Story = StoryObj<typeof FormSelectSearchableMultiple>;

export const Primary = {
  args: {
    name: 'timezones',
    label: 'Form Select Searchable Multiple',
    description:
      'This is a searchable select component with multiple selection',
    options: timezones[0].items,
    placeholder: 'Select timezones',
    emptyText: 'No timezones found',
    popup: true,
    highlight: true,
    showClear: true,
    disabled: false,
    required: false,
  },
} satisfies Story;
