export class ImageCollection extends HTMLElement {
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
