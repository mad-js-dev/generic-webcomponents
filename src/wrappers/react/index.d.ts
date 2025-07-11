import { ForwardRefExoticComponent, RefAttributes } from 'react';

// Base type for all web component props
type WebComponentProps<T = {}> = T & {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

// Component prop types
type CollapsibleItemProps = WebComponentProps<{
  label?: string;
  open?: boolean;
  onToggle?: (event: CustomEvent) => void;
}>;

type CollapsibleListProps = WebComponentProps<{}>;
type IconLabelProps = WebComponentProps<{
  icon?: string;
  label?: string;
}>;
type SelectionMenuProps = WebComponentProps<{}>;
type ImageCollectionProps = WebComponentProps<{}>;
type ProductLayoutProps = WebComponentProps<{}>;

// Component declarations
declare const CollapsibleItem: ForwardRefExoticComponent<CollapsibleItemProps & RefAttributes<HTMLElement>>;
declare const CollapsibleList: ForwardRefExoticComponent<CollapsibleListProps & RefAttributes<HTMLElement>>;
declare const IconLabel: ForwardRefExoticComponent<IconLabelProps & RefAttributes<HTMLElement>>;
declare const SelectionMenu: ForwardRefExoticComponent<SelectionMenuProps & RefAttributes<HTMLElement>>;
declare const ImageCollection: ForwardRefExoticComponent<ImageCollectionProps & RefAttributes<HTMLElement>>;
declare const ProductLayout: ForwardRefExoticComponent<ProductLayoutProps & RefAttributes<HTMLElement>>;

// Define custom elements function
declare function defineCustomElements(): Promise<void>;

// Default export with all components
declare const _default: {
  CollapsibleItem: typeof CollapsibleItem;
  CollapsibleList: typeof CollapsibleList;
  IconLabel: typeof IconLabel;
  SelectionMenu: typeof SelectionMenu;
  ImageCollection: typeof ImageCollection;
  ProductLayout: typeof ProductLayout;
  defineCustomElements: typeof defineCustomElements;
};

export {
  CollapsibleItem,
  CollapsibleList,
  IconLabel,
  SelectionMenu,
  ImageCollection,
  ProductLayout,
  defineCustomElements,
};

export default _default;
