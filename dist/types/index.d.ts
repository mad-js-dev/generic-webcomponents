import { default as ReactWrappers } from './wrappers/react/index.jsx';
export * from './components/molecules/collapsible-list/CollapsibleList.js';
export * from './components/molecules/collapsible-item/CollapsibleItem.js';
export * from './components/atoms/icon-label/IconLabel.js';
export * from './components/organisms/selection-menu/SelectionMenu.js';
export * from './components/organisms/image-collection/ImageCollection.js';
export * from './components/templates/product-layout/ProductLayout.js';
export { default as VuePlugin } from './wrappers/vue';
export { defineCustomElements } from './init';
export const ReactComponents: {
    CollapsibleItem: import('react').ForwardRefExoticComponent<{
        label?: string;
        open?: boolean;
        onToggle?: (event: CustomEvent) => void;
    } & {
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    } & import('react').RefAttributes<HTMLElement>>;
    CollapsibleList: import('react').ForwardRefExoticComponent<{
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    } & import('react').RefAttributes<HTMLElement>>;
    IconLabel: import('react').ForwardRefExoticComponent<{
        icon?: string;
        label?: string;
    } & {
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    } & import('react').RefAttributes<HTMLElement>>;
    SelectionMenu: import('react').ForwardRefExoticComponent<{
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    } & import('react').RefAttributes<HTMLElement>>;
    ImageCollection: import('react').ForwardRefExoticComponent<{
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    } & import('react').RefAttributes<HTMLElement>>;
    ProductLayout: import('react').ForwardRefExoticComponent<{
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    } & import('react').RefAttributes<HTMLElement>>;
    defineCustomElements: typeof import('./wrappers/react/index.jsx').defineCustomElements;
};
export default ReactWrappers;
export namespace Components {
    function load(): Promise<{
        load(): Promise</*elided*/ any>;
    }>;
}
//# sourceMappingURL=index.d.ts.map