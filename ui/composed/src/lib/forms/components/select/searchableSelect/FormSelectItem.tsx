import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
} from '../../../../ui/item';
import { SelectItemType } from '../type';

export const FormSelectItem = ({ item }: { item: SelectItemType }) => (
  <Item
    size="sm"
    key={item.value}
    className="flex flex-col items-baseline gap-0"
  >
    <ItemContent className="flex flex-row gap-0.5 p-0">
      <ItemMedia>{item.icon}</ItemMedia>
      {item.label}
    </ItemContent>
    {item.description && <ItemDescription>{item.description}</ItemDescription>}
  </Item>
);
export default FormSelectItem;
