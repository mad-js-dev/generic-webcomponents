// Core components
export * from './molecules/collapsible-list/CollapsibleList.js';
export * from './atoms/collapsible-item/CollapsibleItem.js';

// Additional components (dynamically imported when needed)
let additionalComponents = {};

// Function to load additional components
export async function loadAdditionalComponents() {
  try {
    const selectionMenuModule = await import('./organisms/selection-menu/SelectionMenu.js');
    additionalComponents.SelectionMenu = selectionMenuModule.default || selectionMenuModule;
  } catch (e) {
    console.warn('SelectionMenu component not found or failed to load', e);
  }

  try {
    const productLayoutModule = await import('./templates/product-layout/ProductLayout.js');
    additionalComponents.ProductLayout = productLayoutModule.default || productLayoutModule;
  } catch (e) {
    console.warn('ProductLayout component not found or failed to load', e);
  }
  
  return additionalComponents;
}

// Export a function to get additional components
export function getAdditionalComponents() {
  return additionalComponents;
}
