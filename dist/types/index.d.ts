import { ForwardRefExoticComponent } from 'react';
import { RefAttributes } from 'react';

export declare class CollapsibleItem extends HTMLLIElement {
    static get observedAttributes(): string[];
    _isExpanded: boolean;
    _handleClick(event: any): void;
    _header: HTMLDivElement | null;
    _content: HTMLDivElement | null;
    _initialRender: boolean;
    _removeShift: boolean;
    rendered: boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _addEventListeners(): void;
    _removeEventListeners(): void;
    _createHeader(): HTMLDivElement;
    _render(): void;
    _isRendering: boolean | undefined;
    _createContent(): HTMLDivElement;
    set expanded(value: boolean);
    get expanded(): boolean;
    _toggleExpanded(): void;
    _updateContentVisibility(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
}

/**
 * CollapsibleList Component
 * A custom element that creates a collapsible list container
 */
export declare class CollapsibleList extends HTMLElement {
    static get observedAttributes(): string[];
    _isUpdating: boolean;
    _handleItemToggle(e: any): void;
    connectedCallback(): Promise<void>;
    _initialized: boolean | undefined;
    _initializeComponent(): void;
    _setupMutationObserver(): void;
    _observer: MutationObserver | undefined;
    /**
     * Updates the reverse heading state for all child collapsible items
     * @private
     */
    private _updateReverseHeading;
    _closeOtherItems(exceptItem: any): void;
    _getOpenItems(): Element[];
    _ensureOneItemExpanded(): void;
}

export declare namespace Components {
    export function load(): Promise<{
        load(): Promise</*elided*/ any>;
    }>;
}

declare namespace _default {
        { CollapsibleList };
        { CollapsibleItem };
        { IconLabel };
        { SelectionMenu };
        { ImageCollection };
        { ProductLayout };
        { defineCustomElements };
}
export default _default;

export declare function defineCustomElements(): Promise<void> | Promise<[CustomElementConstructor, CustomElementConstructor, CustomElementConstructor, CustomElementConstructor, CustomElementConstructor, CustomElementConstructor]>;

/**
 * IconLabel Component
 * A simple component that displays an icon next to a label
 */
export declare class IconLabel extends HTMLElement {
    static get observedAttributes(): string[];
    _icon: string;
    _label: string;
    _reverse: boolean;
    connectedCallback(): void;
    set icon(value: string);
    get icon(): string;
    set label(value: string);
    get label(): string;
    set reverse(value: boolean);
    get reverse(): boolean;
    _render(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
}

export declare class ImageCollection extends HTMLElement {
    static get observedAttributes(): string[];
    _images: any[];
    _handleToggle(event: any): void;
    _currentOpenIndex: number;
    set images(value: any[]);
    get images(): any[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    _isHandlingToggle: boolean | undefined;
    _onItemToggle(event: any): void;
    render(): void;
}

export declare class ProductLayout extends HTMLElement {
    static get observedAttributes(): string[];
    _title: string;
    _images: any[];
    _isConnected: boolean;
    _hasRendered: boolean;
    _isUpdating: boolean;
    _elements: {
        title: HTMLElement | null;
        content: HTMLElement | null;
        imageCollection: HTMLElement | null;
        imageCollectionContainer: HTMLElement | null;
    } | null;
    _render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set images(value: any[]);
    get images(): any[];
    _updateTitle(): void;
    _updateImages(): void;
}

export declare const ReactComponents: {
    CollapsibleItem: ForwardRefExoticComponent<    {
    label?: string;
    open?: boolean;
    onToggle?: (event: CustomEvent) => void;
    } & {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    } & RefAttributes<HTMLElement>>;
    CollapsibleList: ForwardRefExoticComponent<    {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    } & RefAttributes<HTMLElement>>;
    IconLabel: ForwardRefExoticComponent<    {
    icon?: string;
    label?: string;
    } & {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    } & RefAttributes<HTMLElement>>;
    SelectionMenu: ForwardRefExoticComponent<    {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    } & RefAttributes<HTMLElement>>;
    ImageCollection: ForwardRefExoticComponent<    {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    } & RefAttributes<HTMLElement>>;
    ProductLayout: ForwardRefExoticComponent<    {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    } & RefAttributes<HTMLElement>>;
    defineCustomElements: defineCustomElements;
};

/**
 * SelectionMenu Component
 * A collapsible menu that allows selection of leaf nodes using CollapsibleItem
 *
 * @fires item-selected - Dispatched when a leaf node is selected
 * @property {string} items - JSON string representing the menu items structure
 * @property {string} selected - ID of the currently selected item
 */
export declare class SelectionMenu extends HTMLElement {
    static get observedAttributes(): string[];
    _items: any[];
    _selectedId: any;
    _boundOnItemClick: (event: any) => void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set items(value: string);
    get items(): string;
    set selected(value: any);
    get selected(): any;
    _render(): void;
    _renderItems(items: any, level?: number): string;
    _addEventListeners(): void;
    _removeEventListeners(): void;
    _onItemClick(event: any): void;
    _updateSelectedState(): void;
    _hasSelectedDescendant(item: any): any;
    _findItemById(items: any, id: any): any;
}

export declare namespace VuePlugin {
    export function install(app: any): void;
}

export { }


declare namespace VuePlugin {
    function install(app: any): void;
}


export namespace Components {
    function load(): Promise<{
        load(): Promise</*elided*/ any>;
    }>;
}

