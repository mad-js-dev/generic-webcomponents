// Import components
import { CollapsibleItem } from './components/molecules/collapsible-item/CollapsibleItem.js';
import { CollapsibleList } from './components/molecules/collapsible-list/CollapsibleList.js';
import { IconLabel } from './components/atoms/icon-label/IconLabel.js';
import { SelectionMenu } from './components/organisms/selection-menu/SelectionMenu.js';
import { ImageCollection } from './components/organisms/image-collection/ImageCollection.js';

// Track if elements have been defined
let elementsDefined = false;

// Initialize web components
export function defineCustomElements() {
  // Return early if elements are already defined
  if (elementsDefined || window.__GENERIC_WEBCOMPONENTS_DEFINED__) {
    return Promise.resolve();
  }

  // Mark as defined
  elementsDefined = true;
  window.__GENERIC_WEBCOMPONENTS_DEFINED__ = true;

  // Define all custom elements with their actual implementations
  if (!customElements.get('collapsible-list')) {
    customElements.define('collapsible-list', CollapsibleList);
  }
  if (!customElements.get('collapsible-item')) {
    customElements.define('collapsible-item', CollapsibleItem, { extends: 'li' });
  }
  if (!customElements.get('icon-label')) {
    customElements.define('icon-label', IconLabel);
  }
  if (!customElements.get('selection-menu')) {
    customElements.define('selection-menu', SelectionMenu);
  }
  if (!customElements.get('image-collection')) {
    customElements.define('image-collection', ImageCollection);
  }
  if (!customElements.get('product-layout')) {
    customElements.define('product-layout', class extends HTMLElement {
      constructor() {
        super();
        // Implementation will be added based on actual component logic
      }
    });
  }

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
