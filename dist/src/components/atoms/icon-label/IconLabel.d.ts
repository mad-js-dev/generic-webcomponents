/**
 * IconLabel Component
 * A custom element that displays an icon with a label
 */
export class IconLabel extends HTMLElement {
    static get observedAttributes(): string[];
    _icon: string;
    _label: string;
    _reverse: boolean;
    _initialized: boolean;
    connectedCallback(): void;
    _initializeComponent(): void;
    _container: HTMLSpanElement | undefined;
    _iconSlot: HTMLSlotElement | undefined;
    _labelSlot: HTMLSlotElement | undefined;
    _render(): void;
    set icon(value: string);
    get icon(): string;
    set label(value: string);
    get label(): string;
    set reverse(value: boolean);
    get reverse(): boolean;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
}
