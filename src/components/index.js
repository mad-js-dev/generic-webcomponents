// Import all components
import { CollapsibleList } from './molecules/collapsible-list/CollapsibleList.js';
import { CollapsibleItem } from './molecules/collapsible-item/CollapsibleItem.js';
import { IconLabel } from './atoms/icon-label/IconLabel.js';

// Additional components (dynamically imported when needed)
const additionalComponents = {};

// Function to load additional components
async function loadAdditionalComponents() {
  try {
    const { SelectionMenu } = await import('./organisms/selection-menu/SelectionMenu.js');
    if (SelectionMenu) {
      additionalComponents.SelectionMenu = SelectionMenu;
    }
  } catch (e) {
    console.warn('SelectionMenu component not found or failed to load', e);
  }

  try {
    const { ProductLayout } = await import('./templates/product-layout/ProductLayout.js');
    if (ProductLayout) {
      additionalComponents.ProductLayout = ProductLayout;
    }
  } catch (e) {
    console.warn('ProductLayout component not found or failed to load', e);
  }

  try {
    const { ImageCollection } = await import('./organisms/image-collection/ImageCollection.js');
    if (ImageCollection) {
      additionalComponents.ImageCollection = ImageCollection;
    }
  } catch (e) {
    console.warn('ImageCollection component not found or failed to load', e);
  }

  return additionalComponents;
}

// Function to get additional components
function getAdditionalComponents() {
  return { ...additionalComponents };
}

// Export everything
const components = {
  // Core components
  CollapsibleList,
  CollapsibleItem,
  IconLabel,
  
  // Additional components
  loadAdditionalComponents,
  getAdditionalComponents
};

// Named exports
export {
  CollapsibleList,
  CollapsibleItem,
  IconLabel,
  loadAdditionalComponents,
  getAdditionalComponents
};

// Default export
export default components;
