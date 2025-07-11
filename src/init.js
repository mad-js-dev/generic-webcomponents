// Initialize web components
export function defineCustomElements() {
  return Promise.all([
    customElements.whenDefined('collapsible-list'),
    customElements.whenDefined('collapsible-item'),
    customElements.whenDefined('icon-label'),
    customElements.whenDefined('selection-menu'),
    customElements.whenDefined('image-collection'),
    customElements.whenDefined('product-layout')
  ]);
}

// Auto-define components if in a browser environment
if (typeof window !== 'undefined' && !window.__GENERIC_WEBCOMPONENTS_DEFINED__) {
  window.__GENERIC_WEBCOMPONENTS_DEFINED__ = true;
  defineCustomElements().catch(console.error);
}
