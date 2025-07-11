// Core web components
export * from './components/molecules/collapsible-list/CollapsibleList.js';
export * from './components/molecules/collapsible-item/CollapsibleItem.js';
export * from './components/atoms/icon-label/IconLabel.js';
export * from './components/organisms/selection-menu/SelectionMenu.js';
export * from './components/organisms/image-collection/ImageCollection.js';
export * from './components/templates/product-layout/ProductLayout.js';

// Import React wrappers
import ReactWrappers from './wrappers/react/index.jsx';

// Vue plugin
export { default as VuePlugin } from './wrappers/vue';

// Export initialization function
export { defineCustomElements } from './init';

// Additional components that need to be loaded asynchronously
import { loadAdditionalComponents, getAdditionalComponents } from './components';

// Export React wrappers as both default and named exports
export const ReactComponents = ReactWrappers;
export default ReactWrappers;

// Export component loader
export const Components = {
  // Core components are already available via default export
  ...getAdditionalComponents(),
  
  // Method to load additional components
  async load() {
    await loadAdditionalComponents();
    Object.assign(this, getAdditionalComponents());
    return this;
  }
};

// Auto-load additional components in browser environment
if (typeof window !== 'undefined') {
  Components.load().catch(console.error);
}
