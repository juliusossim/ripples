'use client';

import { FC, PropsWithChildren } from 'react';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '../ui/command';
import { EMPTY_PRODUCTS_TEXT } from '../utils/text/productGrid';

export const CommandWrapper: FC<
  PropsWithChildren<{
    trigger: React.ReactNode;
    open: boolean;
    placeholder: string;
    openChange: (open: boolean) => void;
  }>
> = (props) => {
  return (
    <div className="flex flex-col gap-4">
      {props.trigger}
      <CommandDialog open={props.open} onOpenChange={props.openChange}>
        <Command>
          <CommandInput placeholder={props.placeholder} />
          <CommandList>
            <CommandEmpty>{EMPTY_PRODUCTS_TEXT}</CommandEmpty>
            {props.children}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default CommandWrapper;
