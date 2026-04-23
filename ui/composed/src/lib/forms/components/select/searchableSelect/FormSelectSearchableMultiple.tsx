'use client';

import * as React from 'react';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '../../../../ui/combobox';
import { FieldWrapper } from '../../FieldWrappper';
import type { SelectItemType, SelectProps } from '../type';
import FormSelectItem from './FormSelectItem';
import { findSelectedItems } from './utils';

export function FormSelectSearchableMultiple(props: Readonly<SelectProps>) {
  const anchor = useComboboxAnchor();

  return (
    <FieldWrapper
      name={props.name}
      label={props.label}
      description={props.description}
      required={props.required}
    >
      {(field) => {
        const selectedItems = findSelectedItems(
          props.options,
          Array.isArray(field.value) ? field.value : []
        );

        return (
          <Combobox
            multiple
            autoHighlight={props.highlight}
            disabled={props.disabled}
            required={props.required}
            items={props.options}
            value={selectedItems}
            onValueChange={(values) => {
              field.onChange(values.map((value) => value.value));
              field.onBlur();
            }}
            isItemEqualToValue={(item, value) => item.value === value.value}
          >
            <ComboboxChips ref={anchor} className="w-full">
              <ComboboxValue placeholder={props.placeholder}>
                {(values) => (
                  <React.Fragment>
                    {values.map((value: SelectItemType) => (
                      <ComboboxChip key={value.value}>
                        {value.label}
                      </ComboboxChip>
                    ))}
                    <ComboboxChipsInput
                      required={props.required}
                      placeholder={props.placeholder}
                      disabled={props.disabled}
                      onBlur={field.onBlur}
                    />
                  </React.Fragment>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>{props.emptyText}</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    key={item.value}
                    value={item}
                    disabled={item.disabled}
                  >
                    <FormSelectItem item={item} />
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FieldWrapper>
  );
}

export default FormSelectSearchableMultiple;
