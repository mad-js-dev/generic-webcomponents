import { BaseWebComponent } from '../../../../types';

/**
 * CollapsibleItem Component
 * A custom element that creates a collapsible list item
 */
export declare class CollapsibleItem extends HTMLLIElement implements BaseWebComponent {
  /**
   * Whether the item is expanded or collapsed
   */
  expanded: boolean;
  
  /**
   * Optional icon to display next to the label
   */
  icon: string;
  
  /**
   * The text label for the collapsible item
   */
  label: string;
  
  /**
   * If true, removes the left padding from the content area
   */
  removeShift: boolean;
  
  /**
   * If true, hides the expand/collapse icon
   */
  hideIcon: boolean;

  /**
   * Toggles the expanded state of the item
   */
  toggle(): void;

  /**
   * Expands the item
   */
  expand(): void;

  /**
   * Collapses the item
   */
  collapse(): void;

  /**
   * Called when the element is added to the DOM
   */
  connectedCallback(): void;

  /**
   * Called when the element is removed from the DOM
   */
  disconnectedCallback(): void;

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
    'collapsible-item': CollapsibleItem;
  }
  
  interface GlobalEventHandlersEventMap {
    'toggle': CustomEvent<{ expanded: boolean }>;
  }
}
