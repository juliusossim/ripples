import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormSearchableSelectBasic } from './FormSearchableSelectBasic';
import { expect } from 'storybook/test';
import { FormProvider, useForm } from 'react-hook-form';
import { timezones } from '../../../utils/formMocks';

const meta = {
  component: FormSearchableSelectBasic,
  title: 'FormSearchableSelectBasic',
  decorators: [
    (Story) => {
      const methods = useForm({
        defaultValues: {
          timezones: null,
        },
      });
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
} satisfies Meta<typeof FormSearchableSelectBasic>;
export default meta;

type Story = StoryObj<typeof FormSearchableSelectBasic>;

export const Primary = {
  args: {
    name: 'timezones',
    label: 'Form Searchable Select Basic',
    description: 'This is a searchable select component',
    options: timezones[0].items,
    placeholder: 'Select a timezone',
    emptyText: 'No timezones found',
    popup: true,
    highlight: true,
    showClear: true,
    disabled: false,
    required: false,
  },
} satisfies Story;

export const Heading = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/FormSearchableSelectBasic/gi)).toBeTruthy();
  },
} satisfies Story;
