// Import components and data
import { CollapsibleList } from './components/molecules/collapsible-list/CollapsibleList.js';
import { CollapsibleItem } from './components/atoms/collapsible-item/CollapsibleItem.js';
import { mockMenuData } from './mockData.js';

// HMR support
if (import.meta.hot) {
  // Store the current custom elements
  const customElements = new Map();
  
  // Save the original define function
  const originalDefine = customElements.define;
  
  // Override define to track custom elements
  customElements.define = function(name, constructor, options) {
    customElements.set(name, { constructor, options });
    originalDefine.call(customElements, name, constructor, options);
  };
  
  // Handle HMR updates
  import.meta.hot.accept((newModule) => {
    // Re-define all custom elements
    for (const [name, { constructor, options }] of customElements) {
      try {
        customElements.define(name, constructor, options);
        console.log(`[HMR] Re-defined custom element: ${name}`);
      } catch (e) {
        console.error(`[HMR] Failed to re-define custom element ${name}:`, e);
      }
    }
  });
}

// Define the custom elements
if (!customElements.get('collapsible-list')) {
  customElements.define('collapsible-list', CollapsibleList);
}

if (!customElements.get('collapsible-item')) {
  customElements.define('collapsible-item', CollapsibleItem);
}

// HMR: Clean up previous instances
if (import.meta.hot) {
  const cleanup = () => {
    // Add any cleanup code here if needed
  };
  
  // Clean up when the module is disposed
  import.meta.hot.dispose(cleanup);
}

// Example of programmatic usage

// Function to create a collapsible item with nested children
function createCollapsibleItem(itemData) {
  try {
    // Create the item element using the custom element constructor
    const item = new (customElements.get('collapsible-item'))();
    
    // Set reverse-heading if specified
    const shouldReverse = itemData.reverseHeading === true;
    if (shouldReverse) {
      item.setAttribute('reverse-heading', '');
    }
    
    // Create and append header content using a slot
    const headerContent = document.createElement('span');
    headerContent.slot = 'header';
    headerContent.textContent = itemData.title;
    
    // Append the header content
    item.appendChild(headerContent);
    
    // Handle nested children if they exist
    if (itemData.children && itemData.children.length > 0) {
      const nestedList = new (customElements.get('collapsible-list'))();
      nestedList.setAttribute('aria-label', `Submenu for ${itemData.title}`);
      
      // Set reverse-heading on the nested list if specified
      if (shouldReverse) {
        nestedList.setAttribute('reverse-heading', '');
      }
      
      // Process children
      itemData.children.forEach(childData => {
        // Create a new object to avoid mutating the original data
        const childWithInheritedProps = { ...childData };
        
        // If reverseHeading is not explicitly set on the child, inherit from parent
        if (childData.reverseHeading === undefined && itemData.reverseHeading !== undefined) {
          childWithInheritedProps.reverseHeading = itemData.reverseHeading;
        }
        
        const childItem = createCollapsibleItem(childWithInheritedProps);
        if (childItem) {
          nestedList.appendChild(childItem);
        }
      });
      
      item.appendChild(nestedList);
    }
    
    return item;
  } catch (error) {
    console.error('Error creating collapsible item:', error, itemData);
    return null;
  }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Only create the programmatic example if we have mock data
    if (mockMenuData && mockMenuData.length > 0) {
      // Create container for the example
      const container = document.createElement('div');
      container.style.marginTop = '2rem';
      container.style.padding = '1rem';
      container.style.borderTop = '1px solid #eee';
      
      // Create title
      const exampleTitle = document.createElement('h2');
      exampleTitle.textContent = 'Programmatic Example';
      container.appendChild(exampleTitle);
      
      // Create the main list using the custom element constructor
      const list = new (customElements.get('collapsible-list'))();
      list.setAttribute('aria-label', 'Programmatic menu');
      
      // Set reverse-heading at the list level
      list.setAttribute('reverse-heading', 'true');
      
      // Add items from mock data
      const fragment = document.createDocumentFragment();
      mockMenuData.forEach(itemData => {
        const item = createCollapsibleItem({
          ...itemData
        });
        if (item) {
          fragment.appendChild(item);
        }
      });
      
      // Append all items at once
      list.appendChild(fragment);
      
      // Append the container to the body first
      document.body.appendChild(container);
      // Then append the list to the container
      container.appendChild(list);
      
      console.log('Programmatic example created successfully');
    } else {
      console.warn('No mock data available to create programmatic example');
    }
  } catch (error) {
    console.error('Error creating programmatic example:', error);
  }
});

