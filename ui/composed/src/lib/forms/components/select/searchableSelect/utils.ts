import type { SelectGroupType, SelectItemType, SelectOption } from '../type';

function isSelectGroup(option: SelectOption): option is SelectGroupType {
  return 'items' in option;
}

export function flattenSelectOptions(
  options: SelectOption[]
): SelectItemType[] {
  return options.flatMap((option) =>
    isSelectGroup(option) ? option.items : option
  );
}

export function findSelectedItem(
  options: SelectOption[],
  value: string | null | undefined
): SelectItemType | null {
  if (!value) {
    return null;
  }

  return (
    flattenSelectOptions(options).find((item) => item.value === value) ?? null
  );
}

export function findSelectedItems(
  options: SelectOption[],
  values: string[] | null | undefined
): SelectItemType[] {
  if (!values?.length) {
    return [];
  }

  const itemsByValue = new Map(
    flattenSelectOptions(options).map((item) => [item.value, item])
  );

  return values
    .map((value) => itemsByValue.get(value))
    .filter((item): item is SelectItemType => item !== undefined);
}
