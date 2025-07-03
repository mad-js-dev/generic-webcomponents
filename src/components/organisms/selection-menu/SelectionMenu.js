/**
 * SelectionMenu Component
 * A collapsible menu that allows selection of leaf nodes using CollapsibleItem
 * 
 * @fires item-selected - Dispatched when a leaf node is selected
 * @property {string} items - JSON string representing the menu items structure
 * @property {string} selected - ID of the currently selected item
 */

export class SelectionMenu extends HTMLElement {
  static get observedAttributes() {
    return ['items', 'selected'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._items = [];
    this._selectedId = null;
    this._boundOnItemClick = this._onItemClick.bind(this);
    
    // Import the CollapsibleItem component
    import('../../molecules/collapsible-item/CollapsibleItem.js');
  }

  connectedCallback() {
    this._render();
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'items':
        this._items = newValue ? JSON.parse(newValue) : [];
        this._render();
        break;
      case 'selected':
        this._selectedId = newValue;
        this._updateSelectedState();
        break;
    }
  }

  get items() {
    return JSON.stringify(this._items);
  }

  set items(value) {
    this._items = value ? JSON.parse(value) : [];
    this._render();
  }

  get selected() {
    return this._selectedId;
  }

  set selected(value) {
    if (this._selectedId !== value) {
      this._selectedId = value;
      this._updateSelectedState();
    }
  }

  _render() {
    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --primary-color: #4a6cf7;
          --hover-bg: #f5f8ff;
          --selected-bg: #e6f0ff;
          --border-color: #e2e8f0;
          --text-color: #2d3748;
          --text-secondary: #4a5568;
        }
        
        .menu-container {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          overflow: hidden;
        }
        
        .menu-item {
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin: 2px 0;
          border-radius: 4px;
        }
        
        .menu-item:hover {
          background-color: var(--hover-bg, #f5f8ff);
        }
        
        .menu-item--selected {
          background-color: var(--selected-bg, #e6f0ff);
          color: var(--primary-color, #4a6cf7);
          font-weight: 500;
        }
        
        .menu-item--selected:hover {
          background-color: var(--selected-bg, #e6f0ff);
        }
        
        /* Style for the collapsible item header */
        .menu-item::part(header) {
          padding: 8px 12px;
          display: flex;
          align-items: center;
        }
        
        /* Style for the collapsible item content */
        .menu-item::part(content) {
          padding: 4px 0;
        }
        
        /* Remove bullets from ul elements */
        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        
        /* Ensure list items have no default styling */
        li {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        /* Leaf item styles */
        .menu-item__leaf {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-radius: 4px;
        }
        
        .menu-item__leaf:hover {
          background-color: var(--hover-bg, #f5f8ff);
        }
        
        .menu-item__leaf.menu-item--selected {
          background-color: var(--selected-bg, #e6f0ff);
          color: var(--primary-color, #4a6cf7);
          font-weight: 500;
        }
        
        /* Add padding to collapsible item icon */
        .collapsible-item__icon {
          padding: 0 0.5rem;
          font-size: 0.75rem;
        }
      </style>
      <div class="menu-container">
        ${this._renderItems(this._items, 0)}
      </div>
    `;
    
    this._addEventListeners();
  }
  
  _renderItems(items, level = 0) {
    if (!items || !items.length) return '';
    
    // Create a container for the list
    const listContainer = document.createElement('ul');
    listContainer.style.listStyle = 'none';
    listContainer.style.padding = '0';
    listContainer.style.margin = '0';
    
    items.forEach(item => {
      const hasChildren = item.children && item.children.length > 0;
      const isSelected = this._selectedId === item.id;
      
      // Create list item
      const li = document.createElement('li');
      li.setAttribute('data-id', item.id); // Add data-id to all list items
      
      if (hasChildren) {
        // For items with children, use collapsible-item with ▼ icon
        li.setAttribute('is', 'collapsible-item');
        li.setAttribute('data-id', item.id); // Add data-id for event handling
        li.setAttribute('label', item.name);
        li.setAttribute('icon', '▼'); // Always set ▼ for collapsible items
        if (isSelected) li.classList.add('menu-item--selected');
        // Remove the line that was expanding level 0 items by default
        
        // Create nested UL for children
        const childList = document.createElement('ul');
        childList.style.listStyle = 'none';
        childList.style.padding = '0';
        childList.style.margin = '0 0 0 16px';
        
        // Recursively add children
        childList.innerHTML = this._renderItems(item.children, level + 1);
        
        // Create a container for the content slot
        const contentSlot = document.createElement('div');
        contentSlot.slot = 'content';
        contentSlot.appendChild(childList);
        
        li.appendChild(contentSlot);
      } else {
        // For leaf nodes, just use a span
        const span = document.createElement('span');
        span.className = 'menu-item__leaf';
        if (isSelected) span.classList.add('menu-item--selected');
        
      
        
        // Add label
        const label = document.createElement('span');
        label.className = 'menu-item__label';
        label.textContent = item.name;
        span.appendChild(label);
        
        // Add click handler for selection
        span.addEventListener('click', (e) => {
          e.stopPropagation();
          this._selectedId = item.id;
          this._updateSelectedState();
          this.dispatchEvent(new CustomEvent('item-selected', {
            detail: {
              id: item.id,
              item: item,
              name: item.name
            },
            bubbles: true,
            composed: true
          }));
        });
        
        li.appendChild(span);
      }
      
      listContainer.appendChild(li);
    });
    
    return level === 0 ? listContainer.outerHTML : listContainer.innerHTML;
  }
  
  _addEventListeners() {
    this.shadowRoot.addEventListener('click', this._boundOnItemClick);
  }
  
  _removeEventListeners() {
    this.shadowRoot.removeEventListener('click', this._boundOnItemClick);
  }
  
  _onItemClick(event) {
    
    // Check if we clicked on a leaf node (span with menu-item__leaf class)
    const leafNode = event.target.closest('.menu-item__leaf');
    if (leafNode) {
      const listItem = leafNode.closest('li');
      const itemId = listItem ? listItem.getAttribute('data-id') : null;
      
      if (!itemId) {
        console.warn('No data-id found on the clicked item');
        return;
      }
      
      // Find the item in our data structure
      const item = this._findItemById(this._items, itemId);
      
      if (!item) {
        console.warn('Item not found in data structure');
        return;
      }
      
      // Update selected state
      this._selectedId = itemId;
      this._updateSelectedState();
      
      // Dispatch custom event with item details
      const customEvent = new CustomEvent('item-selected', {
        detail: {
          id: itemId,
          item: item,
          name: item.name
        },
        bubbles: true,
        composed: true
      });
      
      const eventDispatched = this.dispatchEvent(customEvent);
      
      // Update the selected attribute
      this.setAttribute('selected', itemId);
      return;
    }
    
    // Handle collapsible item clicks
    const itemElement = event.target.closest('li[is="collapsible-item"]');
    if (!itemElement) {
      return;
    }
    
    
    // Prevent event from bubbling up to parent items
    event.stopPropagation();
    
    // Get the item ID
    const itemId = itemElement.getAttribute('data-id');
    
    if (!itemId) {
      console.warn('No data-id found on collapsible item');
      return;
    }
    
    // Find the item in our data structure
    const item = this._findItemById(this._items, itemId);
    
    if (!item) {
      console.warn('Collapsible item not found in data structure');
      return;
    }
    
    // Only proceed if this has children
    if (item.children && item.children.length > 0) {
      // Toggle expansion for non-leaf items
      const isExpanded = itemElement.hasAttribute('expanded');
      
      if (isExpanded) {
        itemElement.removeAttribute('expanded');
      } else {
        itemElement.setAttribute('expanded', '');
      }
    }
  }
  
  _updateSelectedState() {
    if (!this.shadowRoot) return;
    
    
    // Remove selected class from all items
    const allCollapsibleItems = this.shadowRoot.querySelectorAll('li[is="collapsible-item"]');
    const allLeafItems = this.shadowRoot.querySelectorAll('.menu-item__leaf');
    
    allCollapsibleItems.forEach(item => {
      item.classList.remove('menu-item--selected');
      item.removeAttribute('selected');
    });
    
    allLeafItems.forEach(leaf => {
      leaf.classList.remove('menu-item--selected');
    });
    
    // Add selected class to the selected item
    if (this._selectedId) {
      
      // Check collapsible items
      const selectedCollapsibleItem = this.shadowRoot.querySelector(`li[is="collapsible-item"][data-id="${this._selectedId}"]`);
      if (selectedCollapsibleItem) {
        selectedCollapsibleItem.classList.add('menu-item--selected');
        selectedCollapsibleItem.setAttribute('selected', '');
      }
      
      // Check leaf items
      const selectedLeafItem = this.shadowRoot.querySelector(`li[data-id="${this._selectedId}"] .menu-item__leaf`);
      if (selectedLeafItem) {
        selectedLeafItem.classList.add('menu-item--selected');
      }
      
      // If we didn't find the item, it might be because it's in a closed collapsible item
      if (!selectedCollapsibleItem && !selectedLeafItem) {
        console.warn('Could not find selected item in the DOM. It might be in a closed collapsible section.');
      }
    }
  }
  
  _findItemById(items, id) {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = this._findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }
}

// Define the custom element
if (!customElements.get('selection-menu')) {
  customElements.define('selection-menu', SelectionMenu);
}