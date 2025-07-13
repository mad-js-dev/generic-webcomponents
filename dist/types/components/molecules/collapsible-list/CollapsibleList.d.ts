import { BaseWebComponent } from '../../../../types';


/**
 * CollapsibleList Component
 * A custom element that creates a collapsible list container
 */
export declare class CollapsibleList extends HTMLElement implements BaseWebComponent {
  /**
   * Whether to reverse the heading style
   */
  reverseHeading: boolean;
  
  /**
   * If true, indicates this list contains only one item
   */
  singleItem: boolean;
  
  /**
   * If true, only one item can be expanded at a time (accordion mode)
   */
  accordion: boolean;

  /**
   * Expands all items in the list
   */
  expandAll(): void;

  /**
   * Collapses all items in the list
   */
  collapseAll(): void;

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

  /**
   * Handles item toggle events from child collapsible items
   */
  private _handleItemToggle(event: CustomEvent): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'collapsible-list': CollapsibleList;
  }
}
