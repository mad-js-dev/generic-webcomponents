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

export { }
