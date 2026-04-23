import { Input } from '../../../ui/input';
import { cn } from '../../../utils';
import { FieldWrapper } from '../FieldWrappper';

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  description,
  required,
  className,
  ...props
}) => {
  return (
    <FieldWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      {(field) => {
        const { ref: fieldRef, ...fieldProps } = field;

        return (
          <Input
            {...fieldProps}
            {...props}
            ref={fieldRef}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
          />
        );
      }}
    </FieldWrapper>
  );
};

FormInput.displayName = 'FormInput';
export default FormInput;
