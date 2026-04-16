import type { ReactElement } from 'react';
import { Input } from '@org/ui-primitives';
import { CreatePropertyFormField } from './create-property-form-field';
import type { CreatePropertyFormFieldsProps } from './create-property-form.types';

export function CreatePropertyMediaFields({
  errors,
  register,
}: Readonly<CreatePropertyFormFieldsProps>): ReactElement {
  return (
    <>
      <CreatePropertyFormField
        error={errors.imageUrl?.message}
        id="property-image-url"
        label="Image URL"
      >
        <Input
          id="property-image-url"
          placeholder="https://..."
          type="url"
          {...register('imageUrl')}
        />
      </CreatePropertyFormField>
      <CreatePropertyFormField
        error={errors.imageAlt?.message}
        id="property-image-alt"
        label="Image alt text"
      >
        <Input
          id="property-image-alt"
          placeholder="Exterior view at sunset"
          {...register('imageAlt')}
        />
      </CreatePropertyFormField>
    </>
  );
}
