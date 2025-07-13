import { BaseWebComponent } from '../../../types';

/**
 * IconLabel Component
 * A simple component that displays an icon next to a label
 */
export declare class IconLabel extends HTMLElement implements BaseWebComponent {
  /**
   * The icon to display (can be a URL, data URI, or icon name)
   */
  icon: string;
  
  /**
   * The label text to display
   */
  label: string;
  
  /**
   * Whether to reverse the order of icon and label
   */
  reverse: boolean;

  /**
   * Called when the element is added to the DOM
   */
  connectedCallback(): void;

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;

  /**
   * List of attributes to observe for changes
   */
  static get observedAttributes(): string[];
}

declare global {
  interface HTMLElementTagNameMap {
    'icon-label': IconLabel;
  }
}
