/**
 * SelectionMenu Component
 * A custom element that creates a selectable menu using collapsible-list components
 */
export class SelectionMenu extends HTMLElement {
    static get observedAttributes(): string[];
    _selectedId: any;
    _data: any[];
    _blockEventsOnParent: boolean;
    _reverseHeading: boolean;
    connectedCallback(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set data(value: any[]);
    get data(): any[];
    set blockEventsOnParent(value: boolean);
    get blockEventsOnParent(): boolean;
    set reverseHeading(value: boolean);
    get reverseHeading(): boolean;
    render(): void;
    renderItems(items: any, level?: number): any;
    setupEventListeners(): void;
    _boundHandleClick: ((event: any) => void) | undefined;
    handleItemClick(event: any): void;
    _findItemById(items: any, id: any): any;
    setSelectedItem(id: any): boolean;
}
