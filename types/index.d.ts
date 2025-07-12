// Type definitions for @mad-js-dev/generic-webcomponents
declare module '@mad-js-dev/generic-webcomponents' {
  // Re-export all components
  export * from './components/atoms/icon-label/IconLabel';
  export * from './components/molecules/collapsible-item/CollapsibleItem';
  export * from './components/molecules/collapsible-list/CollapsibleList';
  export * from './components/organisms/image-collection/ImageCollection';
  export * from './components/organisms/selection-menu/SelectionMenu';
  export * from './components/templates/product-layout/ProductLayout';
}

// Global JSX namespace for TypeScript JSX support
declare namespace JSX {
  interface IntrinsicElements {
  }
}

// Global interface for custom elements
declare global {
  // This will be extended by individual component type definitions
  interface HTMLElementTagNameMap {}
}
