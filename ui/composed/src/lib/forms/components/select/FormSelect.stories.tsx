import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { FormSelect } from './FormSelect';

const meta = {
  component: FormSelect,
  title: 'FormSelect',
  decorators: [
    (Story) => {
      const methods = useForm({
        defaultValues: {
          country: '',
          size: '',
          category: 'electronics',
        },
      });
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
} satisfies Meta<typeof FormSelect>;
export default meta;

type Story = StoryObj<typeof FormSelect>;

export const Primary = {
  args: {
    name: 'country',
    label: 'Country',
    placeholder: 'Select a country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia' },
    ],
  },
} satisfies Story;

export const WithDescription = {
  args: {
    name: 'size',
    label: 'Size',
    description: 'Choose your preferred size',
    placeholder: 'Select a size',
    options: [
      { value: 'xs', label: 'Extra Small' },
      { value: 's', label: 'Small' },
      { value: 'm', label: 'Medium' },
      { value: 'l', label: 'Large' },
      { value: 'xl', label: 'Extra Large' },
    ],
  },
} satisfies Story;

export const Required = {
  args: {
    name: 'category',
    label: 'Category',
    description: 'Select a product category',
    required: true,
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'books', label: 'Books' },
      { value: 'home', label: 'Home & Garden' },
    ],
  },
} satisfies Story;

export const Disabled = {
  args: {
    name: 'country',
    label: 'Country',
    disabled: true,
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
    ],
  },
} satisfies Story;
