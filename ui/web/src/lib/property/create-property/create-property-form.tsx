import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ReactElement } from 'react';
import { Button } from '@org/ui-primitives';
import {
  createPropertyFormSchema,
  type CreatePropertyFormInput,
  type CreatePropertyFormValues,
} from './create-property-form.schema';
import {
  createDefaultPropertyFormValues,
  toCreatePropertyRequest,
} from './create-property-form.mapper';
import type { CreatePropertyFormProps } from './create-property-form.types';
import { CreatePropertyBasicFields } from './create-property-basic-fields';
import { CreatePropertyLocationFields } from './create-property-location-fields';
import { CreatePropertyMediaFields } from './create-property-media-fields';
import { CreatePropertyPriceFields } from './create-property-price-fields';

export function CreatePropertyForm({
  disabled = false,
  error,
  isSubmitting,
  onSubmit,
}: Readonly<CreatePropertyFormProps>): ReactElement {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreatePropertyFormInput, undefined, CreatePropertyFormValues>({
    defaultValues: createDefaultPropertyFormValues(),
    resolver: zodResolver(createPropertyFormSchema),
  });

  async function submit(values: CreatePropertyFormValues): Promise<void> {
    await onSubmit(toCreatePropertyRequest(values));
    reset(createDefaultPropertyFormValues());
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
      <CreatePropertyBasicFields errors={errors} register={register} />
      <CreatePropertyLocationFields errors={errors} register={register} />
      <CreatePropertyPriceFields errors={errors} register={register} />
      <CreatePropertyMediaFields errors={errors} register={register} />
      {error ? (
        <p className="rounded-md border bg-muted px-3 py-2 text-sm text-destructive">{error}</p>
      ) : null}
      <Button disabled={disabled || isSubmitting} type="submit">
        {isSubmitting ? 'Publishing...' : 'Publish listing'}
      </Button>
    </form>
  );
}
