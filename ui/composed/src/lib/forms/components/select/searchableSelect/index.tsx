import { lazy } from 'react';
import { SelectProps } from '../type';

const FormSearchableSelectBasic = lazy(() =>
  import('./FormSearchableSelectBasic').then((module) => ({
    default: module.FormSearchableSelectBasic,
  }))
);

const FormSelectSearchableGroup = lazy(() =>
  import('./FormSelectSearchableGroup').then((module) => ({
    default: module.FormSelectSearchableGroup,
  }))
);

const FormSelectSearchableMultiple = lazy(() =>
  import('./FormSelectSearchableMultiple').then((module) => ({
    default: module.FormSelectSearchableMultiple,
  }))
);

export function FormSearchableSelect(props: Readonly<SelectProps>) {
  if (props.multiple) {
    return <FormSelectSearchableMultiple {...props} />;
  }

  if (props.grouped) {
    return <FormSelectSearchableGroup {...props} />;
  }

  return <FormSearchableSelectBasic {...props} />;
}

export default FormSearchableSelect;
