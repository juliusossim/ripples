import type { ReactElement } from 'react';
import { Input } from '@org/ui-primitives';
import { CreatePropertyFormField } from './create-property-form-field';
import type { CreatePropertyFormFieldsProps } from './create-property-form.types';

export function CreatePropertyLocationFields({
  errors,
  register,
}: Readonly<CreatePropertyFormFieldsProps>): ReactElement {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <CreatePropertyFormField error={errors.city?.message} id="property-city" label="City">
        <Input id="property-city" placeholder="Accra" {...register('city')} />
      </CreatePropertyFormField>
      <CreatePropertyFormField
        error={errors.country?.message}
        id="property-country"
        label="Country"
      >
        <Input id="property-country" placeholder="Ghana" {...register('country')} />
      </CreatePropertyFormField>
    </div>
  );
}
