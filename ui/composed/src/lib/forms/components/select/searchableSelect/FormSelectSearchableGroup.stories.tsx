import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { FormSelectSearchableGroup } from './FormSelectSearchableGroup';
import { timezones } from '../../../utils/formMocks';
import { GlobeIcon } from 'lucide-react';

const meta = {
  component: FormSelectSearchableGroup,
  title: 'FormSelectSearchableGroup',
  decorators: [
    (Story) => {
      const methods = useForm({
        defaultValues: {
          timezone: '',
          country: '',
        },
      });
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
} satisfies Meta<typeof FormSelectSearchableGroup>;
export default meta;

type Story = StoryObj<typeof FormSelectSearchableGroup>;

export const Primary = {
  args: {
    name: 'timezone',
    label: 'Timezone',

    options: timezones,

    placeholder: 'Select a timezone',
    emptyText: 'No timezones found',
    popup: false,
    icon: <GlobeIcon />,
    highlight: true,
    showClear: true,
    description: 'Global time zones',
    disabled: false,
    required: true,
  },
} satisfies Story;

export const WithPopup = {
  args: {
    name: 'timezone',
    label: 'Timezone',
    description: 'Select your preferred timezone',
    options: timezones,
    placeholder: 'Select a timezone',
    emptyText: 'No timezones found',
    popup: true,
    highlight: true,
  },
} satisfies Story;

export const Required = {
  args: {
    name: 'country',
    label: 'Country',
    description: 'Choose your country',
    required: true,
    options: timezones,
    placeholder: 'Select a country',
    emptyText: 'No countries found',
    popup: false,
    showClear: true,
    highlight: true,
  },
} satisfies Story;
