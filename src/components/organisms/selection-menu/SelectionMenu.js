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
      li.setAttribute('data-id', item.id);
      
      if (hasChildren) {
        // For items with children, use collapsible-item
        li.setAttribute('is', 'collapsible-item');
        li.setAttribute('data-id', item.id);
        li.setAttribute('label', item.name);
        
        // Determine initial state
        const hasSelectedDescendant = this._hasSelectedDescendant(item);
        const isExpanded = hasSelectedDescendant || isSelected;
        
        // Set initial attributes
        if (isExpanded) {
          li.setAttribute('expanded', '');
          li.setAttribute('icon', '▼');
        } else {
          li.setAttribute('icon', '▶');
        }
        
        // Add selected class if needed
        if (isSelected) {
          li.classList.add('menu-item--selected');
        }
        
        // Create content container with proper styling
        const contentSlot = document.createElement('div');
        contentSlot.slot = 'content';
        contentSlot.style.overflow = 'hidden';
        
        // Create and append child list
        const childList = document.createElement('ul');
        childList.style.listStyle = 'none';
        childList.style.padding = '0';
        childList.style.margin = '0 0 0 1rem';
        childList.innerHTML = this._renderItems(item.children, level + 1);
        
        // Set initial content state based on expanded status
        if (!isExpanded) {
          contentSlot.style.maxHeight = '0';
          contentSlot.style.opacity = '0';
          contentSlot.style.visibility = 'hidden';
          contentSlot.style.padding = '0';
          contentSlot.style.margin = '0';
        } else {
          contentSlot.style.paddingLeft = '1rem';
        }
        
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
    // Handle leaf node clicks
    const leafNode = event.target.closest('.menu-item__leaf');
    if (leafNode) {
      event.stopPropagation();
      const itemId = leafNode.getAttribute('data-id');
      if (itemId) {
        this.selected = itemId;
        this._updateSelectedState();
        this.dispatchEvent(new CustomEvent('item-selected', {
          detail: { id: itemId },
          bubbles: true,
          composed: true
        }));
      }
      return;
    }
    
    // Handle collapsible item clicks
    const header = event.target.closest('.collapsible-item__header');
    if (!header) return;
    
    const itemElement = header.parentElement;
    if (itemElement && itemElement.getAttribute('is') === 'collapsible-item') {
      event.stopPropagation();
      
      // Toggle the expanded state - the CollapsibleItem component will handle the visual changes
      const isExpanded = itemElement.hasAttribute('expanded');
      const content = itemElement.querySelector('[slot="content"]');
      
      if (isExpanded) {
        itemElement.removeAttribute('expanded');
        itemElement.setAttribute('icon', '▶');
      } else {
        itemElement.setAttribute('expanded', '');
        itemElement.setAttribute('icon', '▼');
      }
      
      // Dispatch a custom event for the toggle action
      itemElement.dispatchEvent(new CustomEvent('toggle', {
        detail: { expanded: !isExpanded },
        bubbles: true,
        composed: true
      }));
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
  
  _hasSelectedDescendant(item) {
    if (!item) return false;
    
    // Check if this item is selected
    if (item.id === this._selectedId) return true;
    
    // Check if any child is selected
    if (item.children) {
      return item.children.some(child => this._hasSelectedDescendant(child));
    }
    
    return false;
  }
  
  _findItemById(items, id) {
    if (!items || !items.length) return null;
    
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