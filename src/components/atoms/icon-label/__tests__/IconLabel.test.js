import { IconLabel } from '../IconLabel.js';
import { screen } from '@testing-library/dom';

describe('IconLabel', () => {
  let container;
  
  // Helper function to create an icon-label with given properties
  const createIconLabel = async ({
    icon = '',
    label = '',
    reverse = false,
    parent = document.body
  } = {}) => {
    const element = document.createElement('icon-label');
    if (icon) element.setAttribute('icon', icon);
    if (label) element.setAttribute('label', label);
    if (reverse) element.setAttribute('reverse', '');
    
    parent.appendChild(element);
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for rendering
    return element;
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test('renders with default values', async () => {
    await createIconLabel({ parent: container });
    const element = container.querySelector('icon-label');
    expect(element).toBeInTheDocument();
    expect(element.shadowRoot).not.toBeNull();
  });

  test('displays label text', async () => {
    const testLabel = 'Test Label';
    await createIconLabel({ label: testLabel, parent: container });
    
    const labelSlot = container.querySelector('icon-label').shadowRoot.querySelector('slot[name="label"]');
    expect(labelSlot).toBeInTheDocument();
    
    // Test that the label is in the default slot content
    const labelElement = document.createElement('span');
    labelElement.slot = 'label';
    labelElement.textContent = testLabel;
    container.querySelector('icon-label').appendChild(labelElement);
    
    expect(labelElement.assignedSlot).toBe(labelSlot);
  });

  test('renders icon from image path', async () => {
    const iconPath = '/path/to/icon.png';
    const element = await createIconLabel({ 
      icon: iconPath,
      parent: container 
    });
    
    const img = element.shadowRoot.querySelector('.icon-label__icon img');
    expect(img).not.toBeNull();
    expect(img.src).toContain(iconPath);
    expect(img.alt).toBe('');
  });

  test('toggles reverse class based on attribute', async () => {
    const element = await createIconLabel({ parent: container });
    const containerEl = element.shadowRoot.querySelector('.icon-label');
    
    // Initially should not have reverse class
    expect(containerEl).not.toHaveClass('icon-label--reverse');
    
    // Set reverse attribute
    element.setAttribute('reverse', '');
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Now should have reverse class
    expect(containerEl).toHaveClass('icon-label--reverse');
    
    // Remove reverse attribute
    element.removeAttribute('reverse');
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Should not have reverse class
    expect(containerEl).not.toHaveClass('icon-label--reverse');
  });

  test('updates label when attribute changes', async () => {
    const element = await createIconLabel({ label: 'Initial', parent: container });
    const labelSlot = element.shadowRoot.querySelector('slot[name="label"]');
    
    // Initial label
    const labelElement = document.createElement('span');
    labelElement.slot = 'label';
    labelElement.textContent = 'Initial';
    element.appendChild(labelElement);
    
    expect(labelElement.assignedSlot).toBe(labelSlot);
    
    // Update label
    element.setAttribute('label', 'Updated');
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if the label was updated
    expect(labelElement.textContent).toBe('Updated');
  });

  test('uses default label from text content when no label attribute', async () => {
    const element = document.createElement('icon-label');
    const testText = 'Default Label Text';
    element.textContent = testText;
    container.appendChild(element);
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const labelSlot = element.shadowRoot.querySelector('slot[name="label"]');
    const labelElement = document.createElement('span');
    labelElement.slot = 'label';
    labelElement.textContent = testText;
    element.appendChild(labelElement);
    
    expect(labelElement.assignedSlot).toBe(labelSlot);
  });
});
