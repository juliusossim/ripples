export type SelectItemType = {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
};

export type SelectGroupType = {
  label: string;
  items: SelectItemType[];
};

export type SelectOption = SelectItemType | SelectGroupType;

type BaseSelectProps = {
  name: string;
  options: SelectOption[];
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  iconPosition?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end';
  emptyText?: string;
};

type GroupedSelectProps = BaseSelectProps & {
  grouped: true;
  multiple?: false;
  popup?: boolean;
  showClear?: boolean;
  highlight?: boolean;
};

type MultipleSelectProps = BaseSelectProps & {
  multiple: true;
  grouped?: false;
  popup?: false;
  showClear?: boolean;
  highlight?: boolean;
};

type BasicSelectProps = BaseSelectProps & {
  multiple?: false;
  grouped?: false;
  popup?: boolean;
  showClear?: boolean;
  highlight?: boolean;
};

export type SelectProps =
  | GroupedSelectProps
  | MultipleSelectProps
  | BasicSelectProps;
