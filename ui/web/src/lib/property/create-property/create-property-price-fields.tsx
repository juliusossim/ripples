import type { ReactElement } from 'react';
import { Input } from '@org/ui-primitives';
import { CreatePropertyFormField } from './create-property-form-field';
import type { CreatePropertyFormFieldsProps } from './create-property-form.types';

export function CreatePropertyPriceFields({
  errors,
  register,
}: Readonly<CreatePropertyFormFieldsProps>): ReactElement {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_112px]">
      <CreatePropertyFormField
        error={errors.priceAmount?.message}
        id="property-price"
        label="Price"
      >
        <Input id="property-price" min="1" step="1000" type="number" {...register('priceAmount')} />
      </CreatePropertyFormField>
      <CreatePropertyFormField
        error={errors.priceCurrency?.message}
        id="property-currency"
        label="Currency"
      >
        <Input
          id="property-currency"
          maxLength={3}
          placeholder="USD"
          {...register('priceCurrency')}
        />
      </CreatePropertyFormField>
    </div>
  );
}
