import type { ReactElement } from 'react';
import { Input } from '@org/ui-primitives';
import { CreatePropertyFormField } from './create-property-form-field';
import type { CreatePropertyFormFieldsProps } from './create-property-form.types';

export function CreatePropertyBasicFields({
  errors,
  register,
}: Readonly<CreatePropertyFormFieldsProps>): ReactElement {
  return (
    <>
      <CreatePropertyFormField error={errors.title?.message} id="property-title" label="Title">
        <Input id="property-title" placeholder="Waterfront apartment" {...register('title')} />
      </CreatePropertyFormField>
      <CreatePropertyFormField
        error={errors.description?.message}
        id="property-description"
        label="Description"
      >
        <textarea
          className="min-h-28 rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          id="property-description"
          placeholder="Describe the listing, buyer intent, and standout value."
          {...register('description')}
        />
      </CreatePropertyFormField>
    </>
  );
}
