/**
 * CollapsibleList Component
 * A custom element that creates a collapsible list container
 */

export class CollapsibleList extends HTMLElement {
  static get observedAttributes() {
    return ['reverse-heading', 'single-item', 'accordion'];
  }
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isUpdating = false; // Track if we're currently updating to prevent reentrant calls
    this._handleItemToggle = this._handleItemToggle.bind(this);
    
    const container = document.createElement('div');
    const slot = document.createElement('slot');
    
    // Create styles for the component
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        --indent-size: 1.5rem;
      }
      
      ::slotted(collapsible-item) {
        display: block;
        margin: 0.25rem 0;
        padding: 0;
        width: 100%;
      }
      
      /* Nested lists should have a border */
      ::slotted(collapsible-list) {
        border-left: 1px solid #e0e0e0;
        margin-left: 0.5rem;
        padding-left: 0.5rem;
      }
      
      /* Style for the header in collapsible items */
      .collapsible-item__header {
        display: flex;
        align-items: center;
        width: 100%;
        flex-direction: row;
      }
      
      /* Toggle container styles */
      .collapsible-item__toggle-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--toggle-size, 24px);
        height: var(--toggle-size, 24px);
        margin: var(--toggle-margin, 0 8px 0 0);
        flex-shrink: 0;
      }`;
    
    container.appendChild(slot);
    this.shadowRoot.append(style, container);
  }
  
  async connectedCallback() {
    if (!this._initialized) {
      this._initializeComponent();
      this._initialized = true;
      
      // Set initial reverse heading state
      await this._updateReverseHeading();
      
      // Set up event listeners for accordion behavior
      this.addEventListener('toggle', this._handleItemToggle);
      
      // Ensure at least one item is expanded in accordion mode
      if (this.hasAttribute('accordion')) {
        this._ensureOneItemExpanded();
      }
    }
    
    // Set up mutation observer for dynamic content
    this._setupMutationObserver();
  }
  
  _initializeComponent() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'list');
    }
    
    if (!this.hasAttribute('aria-label') && !this.hasAttribute('aria-labelledby')) {
      console.warn('collapsible-list: Add an aria-label or aria-labelledby attribute for accessibility');
    }
  }
  
  _setupMutationObserver() {
    // Set up a mutation observer to handle dynamically added items and attribute changes
    this._observer = new MutationObserver(async (mutations) => {
      let shouldUpdate = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'reverse-heading') {
          shouldUpdate = true;
          break;
        } else if (mutation.type === 'childList') {
          // Check if any added nodes are collapsible items or lists
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && 
                (node.matches('collapsible-item') || node.matches('collapsible-list'))) {
              shouldUpdate = true;
              break;
            }
          }
          if (shouldUpdate) break;
        }
      }
      
      if (shouldUpdate) {
        await this._updateReverseHeading();
      }
    });
    
    // Start observing the component for attribute changes and child list changes
    this._observer.observe(this, {
      attributes: true,
      attributeFilter: ['reverse-heading'],
      childList: true,
      subtree: true
    });
  }
  
  /**
   * Updates the reverse heading state for all child collapsible items
   * @private
   */
  async _updateReverseHeading() {
    // Prevent reentrant calls
    if (this._isUpdating) return;
    this._isUpdating = true;
    
    try {
      const isReversed = this.hasAttribute('reverse-heading') && 
                       this.getAttribute('reverse-heading') !== 'false';
      
      // Temporarily disconnect observer to prevent infinite loop
      if (this._observer) {
        this._observer.disconnect();
      }
      
      // Process direct child collapsible-items
      const processItems = async (items) => {
        for (const item of items) {
          // Set the attribute on the item
          if (isReversed) {
            item.setAttribute('reverse-heading', '');
          } else {
            item.removeAttribute('reverse-heading');
          }
          
          // Process any nested items in this item (only direct children)
          const nestedItems = item.querySelectorAll(':scope > collapsible-item');
          if (nestedItems.length > 0) {
            await processItems(Array.from(nestedItems));
          }
          
          // Process any nested lists in this item (only direct children)
          const nestedLists = item.querySelectorAll(':scope > collapsible-list');
          if (nestedLists.length > 0) {
            await processLists(Array.from(nestedLists));
          }
        }
      };
      
      // Process nested collapsible-lists
      const processLists = async (lists) => {
        for (const list of lists) {
          // Skip if this is the current list to prevent cycles
          if (list === this) continue;
          
          // Set the attribute on the list
          if (isReversed) {
            list.setAttribute('reverse-heading', '');
          } else {
            list.removeAttribute('reverse-heading');
          }
          
          // Process any direct child items in this list
          const nestedItems = list.querySelectorAll(':scope > collapsible-item');
          if (nestedItems.length > 0) {
            await processItems(Array.from(nestedItems));
          }
          
          // Process any direct child lists
          const nestedLists = list.querySelectorAll(':scope > collapsible-list');
          if (nestedLists.length > 0) {
            await processLists(Array.from(nestedLists));
          }
        }
      };
      
      // Start processing from the current element
      const items = this.querySelectorAll(':scope > collapsible-item');
      if (items.length > 0) {
        await processItems(Array.from(items));
      }
      
      const lists = this.querySelectorAll(':scope > collapsible-list');
      if (lists.length > 0) {
        await processLists(Array.from(lists));
      }
      
      // Force a reflow to ensure all attribute changes are applied
      if (this.shadowRoot) {
        this.shadowRoot.offsetHeight; // This forces a reflow
      }
    } catch (error) {
      console.error('Error updating reverse heading:', error);
    } finally {
      // Reconnect observer if it exists
      if (this._observer) {
        this._observer.observe(this, {
          attributes: true,
          attributeFilter: ['reverse-heading'],
          childList: true,
          subtree: true
        });
      }
      this._isUpdating = false;
    }
  }

  _handleItemToggle(e) {
    if (this._isUpdating) return;
    
    const target = e.target;
    
    // Only process if this is a direct child
    if (target.parentElement === this) {
      this._isUpdating = true;
      
      if (this.hasAttribute('accordion')) {
        // In accordion mode, close other items when one is opened
        if (target.expanded) {
          this._closeOtherItems(target);
        }
      } else if (this.hasAttribute('single-item')) {
        // In single-item mode, just close other items when one is opened
        if (target.expanded) {
          this._closeOtherItems(target);
        }
      }
      
      this._isUpdating = false;
    }
  }
  
  _closeOtherItems(exceptItem) {
    // Don't close items if inside an image-collection
    if (this.closest('image-collection')) {
      return;
    }
    
    const items = this.querySelectorAll('collapsible-item');
    items.forEach(item => {
      if (item !== exceptItem) {
        item.expanded = false;
      }
    });
  }
  
  _getOpenItems() {
    return Array.from(this.querySelectorAll('collapsible-item[expanded]'));
  }
  
  _ensureOneItemExpanded() {
    if (!this.hasAttribute('accordion')) return;
    
    const openItems = this._getOpenItems();
    if (openItems.length === 0) {
      // If no items are open, open the first one
      const firstItem = this.querySelector('collapsible-item');
      if (firstItem) {
        firstItem.setAttribute('expanded', '');
      }
    }
  }
}

// Define the custom element
if (!customElements.get('collapsible-list')) {
  customElements.define('collapsible-list', CollapsibleList);
}
