import z from 'zod';
import { ValidationMessages } from './validationsMessages';

export const CommonSchemas = {
  /**
   * Email validation schema
   */
  email: () =>
    z
      .string()
      .min(1, ValidationMessages.required('Email'))
      .email(ValidationMessages.email),

  /**
   * Password validation schema with customizable requirements
   */
  password: (options?: { minLength?: number; maxLength?: number }) =>
    z
      .string()
      .min(
        options?.minLength ?? 8,
        ValidationMessages.minLength('Password', options?.minLength ?? 8)
      )
      .max(
        options?.maxLength ?? 100,
        ValidationMessages.maxLength('Password', options?.maxLength ?? 100)
      ),

  /**
   * Strong password schema with pattern validation
   */
  strongPassword: () =>
    z
      .string()
      .min(8, ValidationMessages.minLength('Password', 8))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),

  /**
   * Phone number validation schema
   */
  phoneNumber: () =>
    z
      .string()
      .min(1, ValidationMessages.required('Phone number'))
      .regex(/^\+?[\d\s-()]+$/, ValidationMessages.phoneNumber),

  /**
   * URL validation schema
   */
  url: () =>
    z
      .string()
      .min(1, ValidationMessages.required('URL'))
      .url(ValidationMessages.url),

  /**
   * Required string field
   */
  requiredString: (
    fieldName: string,
    options?: { min?: number; max?: number }
  ) =>
    z
      .string()
      .min(1, ValidationMessages.required(fieldName))
      .min(
        options?.min ?? 1,
        options?.min ? ValidationMessages.minLength(fieldName, options.min) : ''
      )
      .max(
        options?.max ?? 1000,
        ValidationMessages.maxLength(fieldName, options?.max ?? 1000)
      ),

  /**
   * Optional string field
   */
  optionalString: (options?: { min?: number; max?: number }) =>
    z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= (options?.min ?? 0),
        options?.min ? ValidationMessages.minLength('Field', options.min) : ''
      )
      .refine(
        (val) => !val || val.length <= (options?.max ?? 1000),
        options?.max ? ValidationMessages.maxLength('Field', options.max) : ''
      ),

  /**
   * Positive number validation
   */
  positiveNumber: (fieldName: string) =>
    z
      .number({
        message: ValidationMessages.required(fieldName),
      })
      .positive(ValidationMessages.positiveNumber),

  /**
   * Date validation
   */
  date: (fieldName: string) =>
    z.date({
      message: ValidationMessages.required(fieldName),
    }),

  /**
   * Future date validation
   */
  futureDate: (fieldName: string) =>
    z
      .date({
        message: ValidationMessages.required(fieldName),
      })
      .refine((date) => date > new Date(), ValidationMessages.futureDate),

  /**
   * Past date validation
   */
  pastDate: (fieldName: string) =>
    z
      .date({
        message: ValidationMessages.required(fieldName),
      })
      .refine((date) => date < new Date(), ValidationMessages.pastDate),
} as const;
