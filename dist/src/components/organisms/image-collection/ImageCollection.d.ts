/**
 * ImageCollection Component
 * A custom element that displays a collection of images in a collapsible list
 */
export class ImageCollection extends HTMLElement {
    static get observedAttributes(): string[];
    _images: any[];
    _hasRendered: boolean;
    _handleItemClick(e: any): boolean;
    _handleKeyDown(e: any): void;
    _handleToggle(e: any): boolean;
    _currentOpenItem: any;
    _initialized: boolean;
    _lastOpenedIndex: number;
    _mutationObserver: MutationObserver | null;
    _intersectionObserver: any;
    _preloadedImages: Map<any, any>;
    _visibleIndices: Set<any>;
    _preloadDistance: number;
    _isInitialLoad: boolean;
    set images(value: any[]);
    get images(): any[];
    connectedCallback(): void;
    _addEventListeners(): void;
    _closeOtherItems(selectedItem: any): void;
    _closeOtherItems(selectedItem: any): void;
    _hasExpandedItem(): boolean;
    _setFirstItemExpanded(): void;
    /**
     * Sets up intersection observer for lazy loading
     * @private
     */
    private _setupIntersectionObserver;
    _observeItems(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    _setupEventListeners(): void;
    _setupMutationObserver(): void;
    getOpenItemIndex(): number;
    /**
     * Forces preloading of all images
     * @public
     */
    public preloadAllImages(): void;
    /**
     * Gets the preload status of an image
     * @param {number} index - Index of the image
     * @returns {string} - Status of the image ('loading', 'loaded', 'error', or undefined if not found)
     * @public
     */
    public getImageStatus(index: number): string;
    openItem(index: any): void;
    /**
     * Preloads all images in the collection
     * @param {number} [priorityIndex] - Optional index to load first
     */
    _preloadImages(priorityIndex?: number): void;
    /**
     * Loads a single image
     * @private
     */
    private _loadImage;
    /**
     * Updates an image in the DOM when it's loaded
     * @private
     */
    private _updateImageInDOM;
    _render(): Promise<void> | undefined;
}
