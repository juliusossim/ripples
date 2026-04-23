export const ValidationMessages = {
  required: (field: string) => `${field} is required`,
  email: 'Please enter a valid email address',
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) =>
    `${field} must not exceed ${max} characters`,
  minValue: (field: string, min: number) => `${field} must be at least ${min}`,
  maxValue: (field: string, max: number) => `${field} must not exceed ${max}`,
  pattern: (field: string) => `${field} format is invalid`,
  passwordMatch: 'Passwords do not match',
  phoneNumber: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  positiveNumber: 'Must be a positive number',
  integer: 'Must be a whole number',
  date: 'Please enter a valid date',
  futureDate: 'Date must be in the future',
  pastDate: 'Date must be in the past',
} as const;
