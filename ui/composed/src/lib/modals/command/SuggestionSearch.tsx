import { CommandGroup, CommandItem } from 'cmdk';
import CommandWrapper from '../commandWrapper';

export interface SuggestionSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandGroupProps[];
  placeholder: string;
  trigger: React.ReactNode;
}
export interface CommandItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}
export interface CommandGroupProps {
  title: string;
  items: CommandItemProps[];
}

export const SuggestionSearch: React.FC<SuggestionSearchProps> = ({
  open,
  onOpenChange,
  items,
  placeholder,
  trigger,
}) => {
  return (
    <CommandWrapper
      trigger={trigger}
      open={open}
      openChange={onOpenChange}
      placeholder={placeholder}
    >
      {items.map((item, index) => (
        <CommandGroup key={`${item.title}-${index}`} heading={item.title}>
          <div className="flex flex-col gap-2">
            {item.items.map((command, index) => (
              <CommandItem key={`${command.title}-${index}`}>
                {command.icon}
                <div className="ml-2">
                  <div>{command.title}</div>
                  {command.description && (
                    <div className="text-sm text-muted-foreground">
                      {command.description}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      ))}
    </CommandWrapper>
  );
};

export default SuggestionSearch;
