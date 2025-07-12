// Import components
import { CollapsibleItem } from './components/molecules/collapsible-item/CollapsibleItem.js';
import { CollapsibleList } from './components/molecules/collapsible-list/CollapsibleList.js';
import { IconLabel } from './components/atoms/icon-label/IconLabel.js';
import { SelectionMenu } from './components/organisms/selection-menu/SelectionMenu.js';
import { ImageCollection } from './components/organisms/image-collection/ImageCollection.js';

// Initialize web components
export function defineCustomElements() {
  // Define all custom elements with their actual implementations
  customElements.define('collapsible-list', CollapsibleList);
  customElements.define('collapsible-item', CollapsibleItem, { extends: 'li' });
  customElements.define('icon-label', IconLabel);
  customElements.define('selection-menu', SelectionMenu);
  customElements.define('image-collection', ImageCollection);
  customElements.define('product-layout', class extends HTMLElement {
    constructor() {
      super();
      // Implementation will be added based on actual component logic
    }
  });

  // Wait for all elements to be defined
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
