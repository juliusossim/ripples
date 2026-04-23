'use client';

import { Button } from '../../../../ui/button';
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '../../../../ui/combobox';
import { InputGroupAddon } from '../../../../ui/input-group';
import { FieldWrapper } from '../../FieldWrappper';
import { SelectItemType, SelectProps } from '../type';
import FormSelectItem from './FormSelectItem';
import { findSelectedItem } from './utils';

export function FormSelectSearchableGroup(props: SelectProps) {
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
            itemToStringValue={(item: SelectItemType) => item.value}
            value={selectedItem}
            onValueChange={(value) => {
              field.onChange(value?.value ?? '');
              field.onBlur();
            }}
            isItemEqualToValue={(item, value) => item.value === value.value}
            disabled={props.disabled}
          >
            {!props.popup && (
              <ComboboxInput
                placeholder={props.placeholder}
                showTrigger={false}
                disabled={props.disabled}
                showClear={props.showClear}
                required={props.required}
                onBlur={field.onBlur}
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
                    className=" w-full justify-between font-normal"
                  >
                    <ComboboxValue placeholder={props.placeholder} />
                  </Button>
                }
              />
            )}

            <ComboboxContent alignOffset={-28} className="w-60">
              {props.popup && (
                <ComboboxInput
                  placeholder={props.placeholder}
                  showTrigger={false}
                  disabled={props.disabled}
                  showClear={props.showClear}
                  required={props.required}
                  onBlur={field.onBlur}
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
                {(group) => (
                  <ComboboxGroup key={group.label} items={group.items}>
                    <ComboboxLabel>{group.label}</ComboboxLabel>
                    <ComboboxCollection>
                      {(item) => (
                        <ComboboxItem
                          key={item.value}
                          value={item}
                          disabled={item.disabled}
                        >
                          <FormSelectItem item={item} />
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FieldWrapper>
  );
}
export default FormSelectSearchableGroup;
