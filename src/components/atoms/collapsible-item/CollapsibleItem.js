/**
 * CollapsibleItem Component
 * A custom element that creates a collapsible list item
 */

export class CollapsibleItem extends HTMLElement {
  static get observedAttributes() {
    return ['expanded', 'reverse-heading', 'hide-icon'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isExpanded = false;
    this._nestedList = null;
    this._showToggle = false;
    this._initialized = false;
    
    // Bind methods
    this._handleHeaderClick = this._handleHeaderClick.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  connectedCallback() {
    // Only initialize once
    if (!this._initialized) {
      this._initializeComponent();
      this._initialized = true;
      
      // Set initial expanded state after component is initialized
      const isExpanded = this.hasAttribute('expanded');
      this._isExpanded = isExpanded;
      
      // Update the DOM
      if (this._nestedContent) {
        this._nestedContent.style.display = isExpanded ? 'block' : 'none';
      }
    }
    
    // Ensure styles and attributes are applied after initial render
    requestAnimationFrame(() => {
      this._updateToggleVisibility();
      this._updateReverseHeading();
      this._updateAriaExpanded();
      
      // Update toggle state based on expanded status
      if (this._toggleElement) {
        if (this.expanded) {
          this._toggleElement.classList.add('collapsible-item__toggle--expanded');
        } else {
          this._toggleElement.classList.remove('collapsible-item__toggle--expanded');
        }
      }
    });
  }

  _initializeComponent() {
    // Clear any existing content
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
    } else {
      this.attachShadow({ mode: 'open' });
    }
    
    // Create the main container
    const content = document.createElement('div');
    content.className = 'collapsible-item';
    
    // Create the header element
    this._headerElement = document.createElement('div');
    this._headerElement.className = 'collapsible-item__header';
    this._headerElement.setAttribute('part', 'header'); // Expose header as a part
    
    // Only create toggle if hide-icon is not true
    let toggleContainer = null;
    if (!this.hasAttribute('hide-icon')) {
      toggleContainer = document.createElement('div');
      toggleContainer.className = 'collapsible-item__toggle-container';
      
      // Create the toggle button
      this._toggleElement = document.createElement('button');
      this._toggleElement.className = 'collapsible-item__toggle';
      this._toggleElement.setAttribute('aria-label', 'Toggle visibility');
      this._toggleElement.setAttribute('aria-expanded', 'false');
      this._toggleElement.innerHTML = '▼';
      
      // Add toggle to its container
      toggleContainer.appendChild(this._toggleElement);
    }
    
    // Create a slot for the header content
    this._headerSlot = document.createElement('slot');
    this._headerSlot.name = 'header';
    
    // Create a container for the header content
    const headerContent = document.createElement('div');
    headerContent.className = 'collapsible-item__content';
    headerContent.appendChild(this._headerSlot);
    
    // Only append toggle container if it exists
    if (toggleContainer) {
      this._headerElement.appendChild(toggleContainer);
    }
    this._headerElement.appendChild(headerContent);
    
    // Create a default slot for nested content
    this._defaultSlot = document.createElement('slot');
    
    // Create the nested content container
    this._nestedContent = document.createElement('div');
    this._nestedContent.className = 'collapsible-item__nested';
    this._nestedContent.style.display = 'none'; // Start collapsed by default
    this._nestedContent.appendChild(this._defaultSlot);
    
    // Add click event to the header and toggle button
    this._headerElement.addEventListener('click', this._handleHeaderClick);
    this._headerElement.addEventListener('keydown', this._handleKeyDown);
    
    // Add click handler specifically for the toggle button
    if (this._toggleElement) {
      this._toggleElement.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }
    
    // Build the DOM structure
    content.appendChild(this._headerElement);
    content.appendChild(this._nestedContent);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        margin: 0;
        padding: 0;
        --toggle-size: 0;
        --toggle-margin: 0;
        --toggle-padding: 0;
      }

      .collapsible-item {
          display: flex;
          flex-direction: column;
          width: 100%;
      }
      
      .collapsible-item__header {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 0;
        padding: 0;
        background: none;
        border: none;
        font: inherit;
        color: inherit;
        cursor: pointer;
      }
      
      .collapsible-item__toggle-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        margin-right: 8px;
      }
      
      .collapsible-item__toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: none;
        border: none;
        cursor: pointer;
        transition: transform 0.2s ease-in-out;
        font-size: 0.8em;
        line-height: 1;
        color: inherit;
        
      }
      
      .collapsible-item__toggle--hidden {
        visibility: hidden;
        width: 0;
        margin: 0;
      }
      
      .collapsible-item__toggle--expanded {
        transform: rotate(180deg);
      }
      
      .collapsible-item__content {
        flex: 1 1 auto;
        min-width: 0; /* Allows content to shrink below its minimum content size */
        text-align: left;
        margin: 0;
        padding: 0;
        overflow: hidden; /* Ensures content doesn't overflow */
        display: flex;
        align-items: center;
      }
      
      .collapsible-item__content ::slotted(*) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; /* Add ellipsis for overflow text */
        text-overflow: ellipsis;
      }
      
      .collapsible-item__nested {
        margin: 0;
        padding: 0;
        display: block;
        overflow: hidden;
      }
    `;
    
    // Append everything to the shadow root
    this.shadowRoot.append(style, content);
  }
  
  _handleHeaderClick(event) {
    // Don't toggle if the click was on a link, button, or input
    const interactiveElements = ['a', 'button', 'input', 'select', 'textarea'];
    if (event.target.closest(interactiveElements.join(','))) {
      return;
    }
    
    // Always allow toggling on header click, regardless of _showToggle
    // This makes the entire header clickable
    event.preventDefault();
    event.stopPropagation();
    this.toggle();
  }
  
  _handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }
  
  _updateToggleVisibility() {
    if (!this._headerElement) return;
    
    const headerContent = this.shadowRoot.querySelector('.collapsible-item__content');
    const isNoChildren = this.hasAttribute('no-children');
    
    // Handle toggle container and icon visibility
    if (this.hasAttribute('hide-icon') || isNoChildren) {
      this._showToggle = false;
      
      // Hide the toggle element if it exists
      if (this._toggleElement) {
        this._toggleElement.style.display = 'none';
      }
      
      // Adjust header content to take full width
      if (headerContent) {
        headerContent.style.marginLeft = '0';
        headerContent.style.paddingLeft = '0';
      }
      
      // Adjust header styles
      this._headerElement.style.paddingLeft = '0';
      this._headerElement.style.marginLeft = '0';
      
      return;
    }
    
    // Show toggle if there's nested content
    const hasNestedItems = this._nestedContent && this._nestedContent.children.length > 0;
    this._showToggle = hasNestedItems;
    
    if (this._toggleElement) {
      this._toggleElement.style.display = this._showToggle ? 'inline-block' : 'none';
      
      // Update toggle rotation based on expanded state
      if (this.expanded) {
        this._toggleElement.classList.add('collapsible-item__toggle--expanded');
      } else {
        this._toggleElement.classList.remove('collapsible-item__toggle--expanded');
      }
    }
    
    if (this._showToggle && this._headerElement) {
      this._headerElement.setAttribute('role', 'button');
      this._headerElement.setAttribute('tabindex', '0');
      this._headerElement.setAttribute('aria-expanded', this.expanded.toString());
      this._headerElement.classList.add('collapsible-item__header--clickable');
      
      // Update toggle class based on expanded state
      if (this.expanded) {
        this._toggleElement.classList.add('collapsible-item__toggle--expanded');
      } else {
        this._toggleElement.classList.remove('collapsible-item__toggle--expanded');
      }
    } else {
      this._toggleElement.style.display = 'none';
      this._toggleElement.classList.add('collapsible-item__toggle--hidden');
      
      // Remove ARIA attributes when toggle is hidden
      this._headerElement.removeAttribute('role');
      this._headerElement.removeAttribute('tabindex');
      this._headerElement.removeAttribute('aria-expanded');
      this._headerElement.classList.remove('collapsible-item__header--clickable');
    }
  }
  
  get expanded() {
    return this._isExpanded;
  }

  set expanded(value) {
    const isExpanded = Boolean(value);
    if (this._isExpanded === isExpanded) return;
    
    this._isExpanded = isExpanded;
    
    // Update the DOM
    if (this._nestedContent) {
      if (isExpanded) {
        this._nestedContent.style.display = 'block';
        this._nestedContent.style.overflow = 'hidden';
        this._nestedContent.style.height = 'auto';
        
        // Animate the height
        const startHeight = this._nestedContent.offsetHeight;
        this._nestedContent.style.height = '0';
        
        requestAnimationFrame(() => {
          this._nestedContent.style.transition = 'height 0.3s ease-in-out';
          this._nestedContent.style.height = `${startHeight}px`;
          
          // Remove the transition after animation completes
          setTimeout(() => {
            this._nestedContent.style.transition = '';
            this._nestedContent.style.height = '';
            this._nestedContent.style.overflow = '';
          }, 300);
        });
      } else {
        // Collapse with animation
        const startHeight = this._nestedContent.offsetHeight;
        this._nestedContent.style.height = `${startHeight}px`;
        this._nestedContent.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
          this._nestedContent.style.transition = 'height 0.3s ease-in-out';
          this._nestedContent.style.height = '0';
          
          // After collapse, set display to none
          setTimeout(() => {
            if (this._nestedContent) {
              this._nestedContent.style.display = 'none';
              this._nestedContent.style.transition = '';
              this._nestedContent.style.height = '';
            }
          }, 300);
        });
      }
    }
    
    // Update header classes and ARIA attributes
    if (this._headerElement) {
      if (isExpanded) {
        this._headerElement.classList.add('collapsible-item__header--expanded');
      } else {
        this._headerElement.classList.remove('collapsible-item__header--expanded');
      }
      
      // Update ARIA attributes when expanded state changes
      if (this._showToggle) {
        this._headerElement.setAttribute('aria-expanded', isExpanded.toString());
      }
    }
    
    // Update toggle element
    if (this._toggleElement) {
      if (isExpanded) {
        this._toggleElement.classList.add('collapsible-item__toggle--expanded');
      } else {
        this._toggleElement.classList.remove('collapsible-item__toggle--expanded');
      }
    }
    
    // Dispatch events
    this._dispatchEvents(isExpanded);
  }
  
  toggle(force) {
    const shouldExpand = force !== undefined ? force : !this.expanded;
    
    // Update the expanded state
    this.expanded = shouldExpand;
    
    // Update ARIA and classes
    this._updateAriaExpanded();
    
    // Update toggle icon
    if (this._toggleElement) {
      if (shouldExpand) {
        this._toggleElement.classList.add('collapsible-item__toggle--expanded');
      } else {
        this._toggleElement.classList.remove('collapsible-item__toggle--expanded');
      }
    }
    
    // Dispatch the change event
    this._dispatchEvents(shouldExpand);
  }
  
  _dispatchEvents(isExpanded) {
    // Dispatch toggle event
    this.dispatchEvent(new CustomEvent('toggle', {
      detail: { expanded: isExpanded },
      bubbles: true,
      composed: true
    }));
    
    // Also dispatch expanded/collapsed events
    const eventType = isExpanded ? 'expanded' : 'collapsed';
    this.dispatchEvent(new CustomEvent(eventType, {
      bubbles: true,
      composed: true
    }));
  }
  
  _updateAriaExpanded() {
    if (this._headerElement) {
      this._headerElement.setAttribute('aria-expanded', this._isExpanded.toString());
    }
  }
  
  _updateReverseHeading() {
    const isReversed = this.hasAttribute('reverse-heading') && 
                     this.getAttribute('reverse-heading') !== 'false';
    
    const header = this.shadowRoot?.querySelector('.collapsible-item__header');
    const toggle = this.shadowRoot?.querySelector('.collapsible-item__toggle-container');
    
    if (header && toggle) {
      if (isReversed) {
        header.style.flexDirection = 'row-reverse';
        toggle.style.margin = '0 0 0 8px';
      } else {
        header.style.flexDirection = 'row';
        toggle.style.margin = '0 8px 0 0';
      }
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'expanded' && oldValue !== newValue) {
      this.expanded = newValue !== null;
      this._updateAriaExpanded();
    } else if (name === 'reverse-heading') {
      this._updateReverseHeading();
    }
  }
}

// Define the custom element
if (!customElements.get('collapsible-item')) {
  customElements.define('collapsible-item', CollapsibleItem);
}
