import { CollapsibleList } from '../CollapsibleList.js';
import { CollapsibleItem } from '../../collapsible-item/CollapsibleItem.js';

describe('CollapsibleList', () => {
  let container;
  
  // Helper function to create a collapsible list with items
  const createCollapsibleList = async ({
    items = [],
    reverseHeading = false,
    parent = document.body,
    nestedLevel = 0,
    label = 'Test List'
  } = {}) => {
    const list = document.createElement('collapsible-list');
    list.setAttribute('aria-label', label);
    if (reverseHeading) list.setAttribute('reverse-heading', '');
    
    // Add items to the list
    for (const itemData of items) {
      const item = document.createElement('collapsible-item');
      item.textContent = itemData.title || `Item ${items.indexOf(itemData) + 1}`;
      
      if (itemData.expanded) item.setAttribute('expanded', '');
      
      // Add nested list if specified
      if (itemData.children && itemData.children.length > 0 && nestedLevel < 2) {
        const nestedList = await createCollapsibleList({
          items: itemData.children,
          reverseHeading,
          nestedLevel: nestedLevel + 1,
          label: `${label} Nested`
        });
        item.appendChild(nestedList);
      }
      
      list.appendChild(item);
      await waitFor(() => item.shadowRoot);
    }
    
    parent.appendChild(list);
    await waitFor(() => list.shadowRoot);
    return list;
  };
  
  // Helper to wait for a condition to be true with retries
  const waitFor = async (condition, { timeout = 3000, interval = 50 } = {}) => {
    const start = Date.now();
    let lastError;

    while (Date.now() - start < timeout) {
      try {
        const result = await Promise.resolve(condition());
        if (result) return result;
      } catch (error) {
        lastError = error;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw lastError || new Error(`Condition not met within ${timeout}ms`);
  };
  
  // Helper to wait for all items to match a condition
  const waitForAllItems = async (list, condition, options) => {
    const items = Array.from(list.querySelectorAll('collapsible-item'));
    await Promise.all(items.map(item => waitFor(() => condition(item), options)));
  };
  
  // Helper to wait for attribute changes
  const waitForAttribute = (element, attribute, expectedValue, options) => {
    return waitFor(() => {
      const value = element.getAttribute(attribute);
      return expectedValue === undefined ? value !== null : value === expectedValue;
    }, options);
  };
  
  // Helper to wait for the next frame
  const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
  
  beforeAll(() => {
    // Define custom elements if not already defined
    if (!customElements.get('collapsible-list')) {
      customElements.define('collapsible-list', CollapsibleList);
    }
    if (!customElements.get('collapsible-item')) {
      customElements.define('collapsible-item', CollapsibleItem);
    }
  });
  
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });
  
  test('renders with items', async () => {
    const list = await createCollapsibleList({
      items: [
        { title: 'Item 1' },
        { title: 'Item 2' },
        { title: 'Item 3' }
      ],
      parent: container
    });
    
    const items = list.querySelectorAll('collapsible-item');
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Item 1');
    expect(items[1].textContent).toContain('Item 2');
    expect(items[2].textContent).toContain('Item 3');
  });
  
  test('applies reverse-heading to all items', async () => {
    const list = await createCollapsibleList({
      items: [
        { title: 'Item 1' },
        { 
          title: 'Parent',
          children: [
            { title: 'Child 1' },
            { title: 'Child 2' }
          ]
        }
      ],
      reverseHeading: true,
      parent: container
    });
    
    // Check direct children
    const items = list.querySelectorAll('collapsible-item');
    items.forEach(item => {
      expect(item).toHaveAttribute('reverse-heading');
    });
    
    // Check nested items
    const nestedItems = list.querySelectorAll('collapsible-item collapsible-item');
    nestedItems.forEach(item => {
      expect(item).toHaveAttribute('reverse-heading');
    });
  });
  
  test('updates reverse-heading when attribute changes', async () => {
    // Create a simple list with two items
    const list = await createCollapsibleList({
      items: [
        { title: 'Item 1' },
        { title: 'Item 2' }
      ],
      parent: container,
      label: 'Test List'
    });
    
    // Wait for initial render
    await waitFor(() => list.shadowRoot);
    
    // Get the items
    const items = Array.from(list.querySelectorAll('collapsible-item'));
    
    // Debug: Log initial state
    console.log('Initial state - list reverse-heading:', list.hasAttribute('reverse-heading'));
    items.forEach((item, i) => {
      console.log(`Item ${i + 1} reverse-heading:`, item.hasAttribute('reverse-heading'));
    });
    
    // Test 1: Initial state - no reverse-heading
    for (const item of items) {
      expect(item.hasAttribute('reverse-heading')).toBe(false);
    }
    
    // Test 2: Set reverse-heading
    console.log('\nSetting reverse-heading to true');
    list.setAttribute('reverse-heading', '');
    
    // Wait for the next microtask to allow for attribute propagation
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Debug: Log state after setting reverse-heading
    console.log('After setting reverse-heading - list reverse-heading:', list.hasAttribute('reverse-heading'));
    items.forEach((item, i) => {
      console.log(`Item ${i + 1} reverse-heading:`, item.hasAttribute('reverse-heading'));
    });
    
    // Check that all items now have reverse-heading
    for (const item of items) {
      expect(item.hasAttribute('reverse-heading')).toBe(true);
    }
    
    // Test 3: Remove reverse-heading
    console.log('\nRemoving reverse-heading');
    list.removeAttribute('reverse-heading');
    
    // Wait for the next microtask to allow for attribute propagation
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Debug: Log state after removing reverse-heading
    console.log('After removing reverse-heading - list reverse-heading:', list.hasAttribute('reverse-heading'));
    items.forEach((item, i) => {
      console.log(`Item ${i + 1} reverse-heading:`, item.hasAttribute('reverse-heading'));
    });
    
    // Check that no items have reverse-heading
    for (const item of items) {
      expect(item.hasAttribute('reverse-heading')).toBe(false);
    }
  });
  
  test('handles dynamically added items', async () => {
    const list = await createCollapsibleList({
      items: [{ title: 'Initial Item' }],
      parent: container
    });
    
    // Add a new item
    const newItem = document.createElement('collapsible-item');
    newItem.textContent = 'Dynamic Item';
    list.appendChild(newItem);
    await nextFrame();
    
    // Check that the new item was added
    const items = list.querySelectorAll('collapsible-item');
    expect(items.length).toBe(2);
    expect(items[1].textContent).toContain('Dynamic Item');
    
    // Set reverse-heading and check new item
    list.setAttribute('reverse-heading', '');
    await nextFrame();
    
    // New item should have reverse-heading
    expect(newItem).toHaveAttribute('reverse-heading');
  });
  
  test('nests lists correctly', async () => {
    const list = await createCollapsibleList({
      items: [
        {
          title: 'Parent',
          children: [
            { title: 'Child 1' },
            { title: 'Child 2' }
          ]
        }
      ],
      parent: container
    });
    
    const parentItem = list.querySelector('collapsible-item');
    const nestedList = parentItem.querySelector('collapsible-list');
    const nestedItems = nestedList.querySelectorAll('collapsible-item');
    
    expect(nestedList).toBeInTheDocument();
    expect(nestedItems.length).toBe(2);
    expect(nestedItems[0].textContent).toContain('Child 1');
    expect(nestedItems[1].textContent).toContain('Child 2');
  });
  
  test('has proper accessibility attributes', async () => {
    const list = await createCollapsibleList({
      items: [{ title: 'Test Item' }],
      parent: container,
      label: 'Test List'
    });
    
    expect(list).toHaveAttribute('role', 'list');
    expect(list).toHaveAttribute('aria-label', 'Test List');
  });
  
  test('cleans up mutation observer on disconnect', async () => {
    // Spy on the MutationObserver prototype
    const disconnectSpy = jest.spyOn(MutationObserver.prototype, 'disconnect');
    
    // Create and append the list
    const list = await createCollapsibleList({
      items: [{ title: 'Test Item' }],
      parent: container,
      label: 'Test List'
    });
    
    // Remove the list from the DOM
    container.removeChild(list);
    await nextFrame();
    
    // Check that disconnect was called
    expect(disconnectSpy).toHaveBeenCalled();
    
    // Clean up
    disconnectSpy.mockRestore();
  });
});
