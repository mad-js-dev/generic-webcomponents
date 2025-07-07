export class CollapsibleItem extends HTMLLIElement {
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
