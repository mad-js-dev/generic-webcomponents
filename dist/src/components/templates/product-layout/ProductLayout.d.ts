export class ProductLayout extends HTMLElement {
    static get observedAttributes(): string[];
    _title: string;
    _images: any[];
    _isConnected: boolean;
    _hasRendered: boolean;
    _isUpdating: boolean;
    _elements: {
        title: Element | null;
        imageContainer: Element | null;
        header: Element | null;
        content: Element | null;
    } | null;
    _render(): void;
    set images(value: any[]);
    get images(): any[];
    connectedCallback(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    _renderImageCollection(): string;
    _cacheElements(): void;
    _updateTitle(): void;
    _updateImages(): void;
}
