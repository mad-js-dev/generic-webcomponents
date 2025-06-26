/**
 * CollapsibleItem Component
 * A custom element that creates a collapsible list item
 */
export class CollapsibleItem extends HTMLElement {
    static get observedAttributes(): string[];
    _isExpanded: boolean;
    _nestedList: any;
    _showToggle: boolean;
    _initialized: boolean;
    _handleHeaderClick(event: any): void;
    _handleKeyDown(event: any): void;
    connectedCallback(): void;
    _initializeComponent(): void;
    _headerElement: HTMLDivElement | undefined;
    _toggleElement: HTMLButtonElement | undefined;
    _headerSlot: HTMLSlotElement | undefined;
    _defaultSlot: HTMLSlotElement | undefined;
    _nestedContent: HTMLDivElement | undefined;
    _updateToggleVisibility(): void;
    set expanded(value: boolean);
    get expanded(): boolean;
    toggle(force: any): void;
    _dispatchEvents(isExpanded: any): void;
    _updateAriaExpanded(): void;
    _updateReverseHeading(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
}
