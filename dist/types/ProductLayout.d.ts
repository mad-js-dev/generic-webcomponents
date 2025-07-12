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

export { }
