'use client';

import { Button } from '../../../../ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '../../../../ui/combobox';
import { InputGroupAddon } from '../../../../ui/input-group';
import { FieldWrapper } from '../../FieldWrappper';
import { SelectItemType, SelectProps } from '../type';
import FormSelectItem from './FormSelectItem';
import { findSelectedItem } from './utils';

export function FormSearchableSelectBasic(props: Readonly<SelectProps>) {
  return (
    <FieldWrapper
      name={props.name}
      label={props.label}
      description={props.description}
      required={props.required}
    >
      {(field) => {
        const selectedItem = findSelectedItem(
          props.options,
          typeof field.value === 'string' ? field.value : null
        );

        return (
          <Combobox
            items={props.options}
            autoHighlight={props.highlight}
            itemToStringValue={(item?: SelectItemType) => item?.value ?? ''}
            disabled={props.disabled}
            value={selectedItem}
            onValueChange={(value) => {
              field.onChange(value?.value ?? '');
              field.onBlur();
            }}
            isItemEqualToValue={(item, value) =>
              item?.value !== undefined && value?.value !== undefined
                ? item.value === value.value
                : false
            }
          >
            {!props.popup && (
              <ComboboxInput
                placeholder={props.placeholder}
                showTrigger={false}
                showClear={props.showClear}
                onBlur={field.onBlur}
                required={props.required}
              >
                {props.icon && (
                  <InputGroupAddon align={props.iconPosition}>
                    {props.icon}
                  </InputGroupAddon>
                )}
              </ComboboxInput>
            )}

            {props.popup && (
              <ComboboxTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    <ComboboxValue placeholder={props.placeholder} />
                  </Button>
                }
              />
            )}

            <ComboboxContent>
              {props.popup && (
                <ComboboxInput
                  placeholder={props.placeholder}
                  showTrigger={false}
                  showClear={props.showClear}
                  onBlur={field.onBlur}
                  required={props.required}
                >
                  {props.icon && (
                    <InputGroupAddon align={props.iconPosition}>
                      {props.icon}
                    </InputGroupAddon>
                  )}
                </ComboboxInput>
              )}

              <ComboboxEmpty>{props.emptyText}</ComboboxEmpty>

              <ComboboxList>
                {(item: SelectItemType) => (
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

export default FormSearchableSelectBasic;
