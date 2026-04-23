import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { FormCheckbox } from './FormCheckbox';

const meta = {
  component: FormCheckbox,
  title: 'FormCheckbox',
  decorators: [
    (Story) => {
      const methods = useForm({
        defaultValues: {
          agreeToTerms: false,
        },
      });
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
} satisfies Meta<typeof FormCheckbox>;
export default meta;

type Story = StoryObj<typeof FormCheckbox>;

export const Primary = {
  args: {
    name: 'agreeToTerms',
    label: 'Agree to Terms and Conditions',
    description: 'You must agree to the terms and conditions to continue',
    disabled: false,
  },
} satisfies Story;

export const WithoutDescription = {
  args: {
    name: 'newsletter',
    label: 'Subscribe to newsletter',
    disabled: false,
  },
} satisfies Story;

export const Disabled = {
  args: {
    name: 'disabledOption',
    label: 'This option is disabled',
    description: 'You cannot select this option',
    disabled: true,
  },
} satisfies Story;
