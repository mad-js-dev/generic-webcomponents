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

export { }
