/**
 * IconLabel Component
 * A simple component that displays an icon next to a label
 */
export declare class IconLabel extends HTMLElement {
    static get observedAttributes(): string[];
    _icon: string;
    _label: string;
    _reverse: boolean;
    connectedCallback(): void;
    set icon(value: string);
    get icon(): string;
    set label(value: string);
    get label(): string;
    set reverse(value: boolean);
    get reverse(): boolean;
    _render(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
}

export { }
