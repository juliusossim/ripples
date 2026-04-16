import type { CreatePropertyRequest } from '@org/types';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { CreatePropertyFormInput } from './create-property-form.schema';

export interface CreatePropertyFormProps {
  readonly disabled?: boolean;
  readonly error?: string;
  readonly isSubmitting: boolean;
  readonly onSubmit: (input: CreatePropertyRequest) => Promise<void>;
}

export interface CreatePropertyFormFieldsProps {
  readonly errors: FieldErrors<CreatePropertyFormInput>;
  readonly register: UseFormRegister<CreatePropertyFormInput>;
}
