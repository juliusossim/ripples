import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { CommandWrapperProps } from './command-wrapper.types';

const DEFAULT_EMPTY_TEXT = 'No results found.';

export function CommandWrapper({
  trigger,
  open,
  placeholder,
  openChange,
  children,
  emptyText = DEFAULT_EMPTY_TEXT,
  dialogClassName,
  title = 'Search',
  description = 'Search through available suggestions.',
  showCloseButton = true,
}: Readonly<CommandWrapperProps>): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {trigger}
      <CommandDialog
        className={dialogClassName}
        description={description}
        open={open}
        onOpenChange={openChange}
        showCloseButton={showCloseButton}
        title={title}
      >
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {children}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
