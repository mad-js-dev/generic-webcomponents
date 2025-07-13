/**
 * Type definitions for @mad-js-dev/generic-webcomponents
 */

declare namespace GenericWebComponents {
  // Base interface for all web components
  interface BaseWebComponent extends HTMLElement {
    /**
     * Called when the element is added to the DOM
     */
    connectedCallback?(): void;
    
    /**
     * Called when the element is removed from the DOM
     */
    disconnectedCallback?(): void;
    
    /**
     * Called when an observed attribute changes
     */
    attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
  }

  // Event types
  interface ToggleEvent extends CustomEvent<{
    /** Whether the element is expanded */
    expanded: boolean;
  }> {}
}

// Global JSX namespace for web components
declare namespace JSX {
  interface IntrinsicElements {
    // IconLabel Component
    'icon-label': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        /** The icon to display (can be a URL, data URI, or icon name) */
        icon?: string;
        /** The label text to display */
        label?: string;
        /** Whether to reverse the order of icon and label */
        reverse?: boolean;
      },
      HTMLElement
    >;

    // CollapsibleItem Component
    'collapsible-item': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        /** Whether the item is expanded */
        expanded?: boolean;
        /** The header text for the collapsible item */
        header?: string;
        /** Callback when the item is toggled */
        onToggle?: (event: GenericWebComponents.ToggleEvent) => void;
      },
      HTMLElement
    >;

    // CollapsibleList Component
    'collapsible-list': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        /** Whether multiple items can be expanded at once */
        multiple?: boolean;
        /** Index or array of indexes of initially expanded items */
        defaultExpanded?: number | number[];
      },
      HTMLElement
    >;
  }
}

// Export types for TypeScript users
export type {
  BaseWebComponent,
  ToggleEvent
} from './types';

export {};
