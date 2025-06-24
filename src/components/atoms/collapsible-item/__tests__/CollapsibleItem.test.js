import { CollapsibleItem } from '../CollapsibleItem.js';
import { screen, fireEvent, waitFor } from '@testing-library/dom';

describe('CollapsibleItem', () => {
  let container;
  
  // Helper function to create a collapsible item with given properties
  const createCollapsibleItem = async ({
    title = 'Test Item',
    expanded = false,
    reverseHeading = false,
    hasChildren = false,
    parent = document.body
  } = {}) => {
    const item = document.createElement('collapsible-item');
    item.textContent = title;
    
    if (expanded) item.setAttribute('expanded', '');
    if (reverseHeading) item.setAttribute('reverse-heading', '');
    
    if (hasChildren) {
      const nestedList = document.createElement('collapsible-list');
      const childItem = document.createElement('collapsible-item');
      childItem.textContent = 'Child Item';
      nestedList.appendChild(childItem);
      item.appendChild(nestedList);
    }
    
    parent.appendChild(item);
    await waitFor(() => item.shadowRoot);
    return item;
  };
  
  // Helper to wait for the next frame and ensure styles are applied
  const nextFrame = () => new Promise(resolve => {
    requestAnimationFrame(() => {
      // Force a reflow to ensure styles are applied
      document.body.offsetHeight;
      resolve();
    });
  });
  
  // Helper to wait for a condition to be true
  const waitForCondition = async (condition, timeout = 1000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await condition()) return true;
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return false;
  };
  
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });
  
  test('renders with title', async () => {
    const title = 'Test Item';
    await createCollapsibleItem({ title, parent: container });
    
    const item = container.querySelector('collapsible-item');
    expect(item).toBeInTheDocument();
    expect(item.textContent).toContain(title);
  });
  
  test('shows toggle button when has children', async () => {
    const item = await createCollapsibleItem({
      title: 'Parent',
      hasChildren: true,
      parent: container
    });
    
    const toggle = item.shadowRoot.querySelector('.collapsible-item__toggle');
    expect(toggle).not.toHaveClass('collapsible-item__toggle--hidden');
    expect(toggle).toHaveStyle('display: inline-block');
  });
  
  test('hides toggle button when no children', async () => {
    const item = await createCollapsibleItem({
      title: 'No Children',
      hasChildren: false,
      parent: container
    });
    
    const toggle = item.shadowRoot.querySelector('.collapsible-item__toggle');
    expect(toggle).toHaveStyle('display: none');
  });
  
  test('toggles expanded state when header is clicked', async () => {
    const item = await createCollapsibleItem({
      title: 'Parent',
      hasChildren: true,
      parent: container
    });
    
    const header = item.shadowRoot.querySelector('.collapsible-item__header');
    const nestedContent = item.shadowRoot.querySelector('.collapsible-item__nested');
    const toggle = item.shadowRoot.querySelector('.collapsible-item__toggle');
    
    // Initially collapsed
    expect(toggle).not.toHaveClass('collapsible-item__toggle--expanded');
    expect(nestedContent).toHaveStyle('display: none');
    
    // Click to expand
    header.click();
    await nextFrame();
    
    // Wait for expanded state
    await waitForCondition(() => toggle.classList.contains('collapsible-item__toggle--expanded'));
    expect(toggle).toHaveClass('collapsible-item__toggle--expanded');
    
    // Wait for content to be visible
    await waitForCondition(() => {
      const style = window.getComputedStyle(nestedContent);
      return style.display === 'block';
    });
    
    // Click to collapse
    header.click();
    
    // Wait for collapsed state
    await waitForCondition(() => !toggle.classList.contains('collapsible-item__toggle--expanded'));
    expect(toggle).not.toHaveClass('collapsible-item__toggle--expanded');
    
    // Check that content is hidden
    const collapsedStyle = window.getComputedStyle(nestedContent);
    expect(collapsedStyle.display).toBe('none');
  });
  
  test('applies reverse heading styles when reverse-heading is set', async () => {
    const item = await createCollapsibleItem({
      title: 'Reversed',
      reverseHeading: true,
      hasChildren: true,
      parent: container
    });
    
    const header = item.shadowRoot.querySelector('.collapsible-item__header');
    const toggleContainer = item.shadowRoot.querySelector('.collapsible-item__toggle-container');
    
    expect(header).toHaveStyle('flex-direction: row-reverse');
    expect(toggleContainer).toHaveStyle('margin: 0px 0px 0px 8px');
  });
  
  test('dispatches toggle event when toggled', async () => {
    const item = await createCollapsibleItem({
      title: 'Event Test',
      hasChildren: true,
      parent: container
    });
    
    const header = item.shadowRoot.querySelector('.collapsible-item__header');
    let eventFired = false;
    
    item.addEventListener('toggle', (e) => {
      eventFired = true;
      expect(e.detail.expanded).toBe(true);
    });
    
    header.click();
    await nextFrame();
    
    expect(eventFired).toBe(true);
  });
  
  test('respects expanded attribute', async () => {
    const item = await createCollapsibleItem({
      title: 'Expanded',
      expanded: true,
      hasChildren: true,
      parent: container
    });
    
    const toggle = item.shadowRoot.querySelector('.collapsible-item__toggle');
    const nestedContent = item.shadowRoot.querySelector('.collapsible-item__nested');
    
    // Wait for expanded state
    await waitForCondition(() => toggle.classList.contains('collapsible-item__toggle--expanded'));
    expect(toggle).toHaveClass('collapsible-item__toggle--expanded');
    
    // Wait for content to be visible
    await waitForCondition(() => {
      const style = window.getComputedStyle(nestedContent);
      return style.display === 'block';
    });
    
    expect(item).toHaveAttribute('expanded');
  });
  
  test('updates ARIA attributes when toggled', async () => {
    const item = await createCollapsibleItem({
      title: 'ARIA Test',
      hasChildren: true,
      parent: container
    });
    
    const header = item.shadowRoot.querySelector('.collapsible-item__header');
    
    // Initially collapsed
    expect(header).toHaveAttribute('aria-expanded', 'false');
    
    // Expand
    header.click();
    
    // Wait for expanded state
    await waitForCondition(() => header.getAttribute('aria-expanded') === 'true');
    expect(header).toHaveAttribute('aria-expanded', 'true');
  });
});
