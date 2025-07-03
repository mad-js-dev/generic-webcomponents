// Global type definitions for your web components

// Import individual component type definitions
import './components/icon-label';

// Global JSX namespace for TypeScript JSX support
declare namespace JSX {
  interface IntrinsicElements {
    // This will be extended by individual component type definitions
    [elemName: string]: any;
  }
}

// Global interface for custom elements
declare global {
  // This will be extended by individual component type definitions
  interface HTMLElementTagNameMap {}
}
