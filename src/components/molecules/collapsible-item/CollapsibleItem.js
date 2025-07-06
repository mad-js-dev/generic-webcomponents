/**
 * CollapsibleItem Component
 * A custom element that creates a collapsible list item
 * 
 * @attr {boolean} expanded - Whether the item is expanded or collapsed
 * @attr {string} icon - Optional icon to display next to the label
 * @attr {string} label - The text label for the collapsible item
 * @attr {boolean} removeshift - If true, removes the left padding from the content area
 */

import { IconLabel } from '../../atoms/icon-label/IconLabel.js';

// Import regular CSS
import './CollapsibleItem.css';

export class CollapsibleItem extends HTMLLIElement {
    static get observedAttributes() {
        return ['expanded', 'icon', 'label', 'removeshift', 'hide-icon'];
    }
    
    constructor() {
        super();
        this._isExpanded = false;
        this._handleClick = this._handleClick.bind(this);
        this._header = null;
        this._content = null;
        this._initialRender = true;
        this._removeShift = false;
        this.rendered = false;
        
        // Add base class to the host element
        this.classList.add('collapsible-item');
        
        // Initialize expanded state
        if (this.hasAttribute('expanded')) {
            this._isExpanded = true;
            this.classList.add('collapsible-item--expanded');
        }
        
        // Initialize no-padding state
        if (this.hasAttribute('removeshift')) {
            this.classList.add('collapsible-item--no-padding');
        }
    }

    connectedCallback() {
        // Ensure the component has the correct role for accessibility
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'listitem');
        }
        
        // Set up the component if not already rendered
        if (!this.rendered) {
            this._render();
            this.rendered = true;
            this._addEventListeners();
            
            // Ensure the content visibility is set correctly based on the expanded state
            this._updateContentVisibility();
        }
        
        // Ensure the component is properly styled
        this.classList.add('collapsible-item');
        
        // Set initial expanded state
        if (this.hasAttribute('expanded')) {
            this._isExpanded = true;
            this.classList.add('collapsible-item--expanded');
        } else {
            this._isExpanded = false;
            this.classList.remove('collapsible-item--expanded');
        }
    }
    
    disconnectedCallback() {
        this._removeEventListeners();
    }
    
    _addEventListeners() {
        // Add click listener to the component itself for event delegation
        this.addEventListener('click', this._handleClick);
    }
    
    _removeEventListeners() {
        this.removeEventListener('click', this._handleClick);
    }
    
    _handleClick(event) {
        // Find the closest header from the click target
        const header = event.target.closest('.collapsible-item__header');
        if (!header) return; // Not a header click
        
        // Prevent the default action to avoid any native behavior
        event.preventDefault();
        event.stopPropagation();
        
        // Toggle the expanded state
        const isExpanding = !this.hasAttribute('expanded');
        
        // Update the expanded attribute
        if (isExpanding) {
            this.setAttribute('expanded', '');
        } else {
            this.removeAttribute('expanded');
        }
        
        // Update the internal state and UI
        this._isExpanded = isExpanding;
        this._updateContentVisibility();
        
        // Dispatch a custom event
        this.dispatchEvent(new CustomEvent('toggle', {
            detail: { expanded: isExpanding },
            bubbles: true,
            composed: true
        }));
    }
    
    _createHeader() {
        const header = document.createElement('div');
        header.className = 'collapsible-item__header';
        
        // Create a container for the icon and label
        const contentWrapper = document.createElement('div');
        contentWrapper.style.display = 'flex';
        contentWrapper.style.alignItems = 'center';
        contentWrapper.style.flex = '1';
        
        // Add icon if provided and not hidden
        const hideIcon = this.hasAttribute('hide-icon');
        const icon = this.getAttribute('icon');
        if (icon && !hideIcon) {
            const iconEl = document.createElement('span');
            iconEl.className = 'collapsible-item__icon';
            iconEl.textContent = icon;
            iconEl.style.marginRight = '0.5rem';
            contentWrapper.appendChild(iconEl);
        }
        
        // Add label
        const label = this.getAttribute('label') || '';
        if (label) {
            const labelEl = document.createElement('span');
            labelEl.className = 'collapsible-item__label';
            labelEl.textContent = label;
            contentWrapper.appendChild(labelEl);
        }
        
        // Add the content wrapper to the header
        header.appendChild(contentWrapper);
                
        return header;
    }
    
    _render() {
        // Prevent re-entrancy during rendering
        if (!this._isRendering) {
            this._isRendering = true;
            
            // Store any existing content that should be preserved
            const existingContent = [];
            Array.from(this.children).forEach(child => {
                if (child !== this._header && child !== this._content) {
                    existingContent.push(child);
                }
            });
            
            // Clear existing content
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
            
            // Create and append header
            this._header = this._createHeader();
            this.appendChild(this._header);
            
            // Set header attributes for accessibility
            if (this._header) {
                this._header.setAttribute('role', 'button');
                this._header.setAttribute('aria-expanded', this._isExpanded ? 'true' : 'false');
                this._header.setAttribute('tabindex', '0');
                
                // Add keyboard support
                this._header.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this._toggleExpanded();
                    }
                });
            }
            
            // Create and append content container
            this._content = this._createContent();
            if (this._content) {
                this.appendChild(this._content);
                
                // Add back any existing content to the content container
                existingContent.forEach(child => {
                    this._content.appendChild(child);
                });
            }
            
            // Ensure proper ARIA attributes for accessibility
            this.setAttribute('role', 'listitem');
            
            // Set initial content visibility
            this._updateContentVisibility();
            
            // Mark as rendered
            this.rendered = true;
            this._isRendering = false;
        }
    }
    
    _createContent() {
        const content = document.createElement('div');
        content.className = 'collapsible-item__content';
        
        // Filter out any header elements and their content
        const headerElements = this.querySelectorAll('.collapsible-item__header, .collapsible-item__label, .collapsible-item__icon');
        const headerElementSet = new Set(headerElements);
        
        // Process direct children that are not part of the header
        const filteredChildren = Array.from(this.childNodes).filter(node => {
            // Keep only element nodes that are not in the header
            if (node.nodeType === Node.ELEMENT_NODE) {
                return !headerElementSet.has(node) && !node.closest('.collapsible-item__header');
            }
            // Keep text nodes that are not just whitespace
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent.trim() !== '' && 
                       !node.textContent.includes('▶') && 
                       !node.textContent.includes('▼');
            }
            return false;
        });
        
        // Add the filtered children to the content
        filteredChildren.forEach(child => {
            content.appendChild(child.cloneNode(true));
        });
        
        return content;
    }
    
    get expanded() {
        return this._isExpanded;
    }
    
    set expanded(value) {
        if (this._isExpanded === value) return; // No change needed
        
        this._isExpanded = value;
        
        // Update the attribute to reflect the state in the DOM
        if (this._isExpanded) {
            this.setAttribute('expanded', '');
        } else {
            this.removeAttribute('expanded');
        }
        
        // Update the content visibility immediately
        this._updateContentVisibility();
        
        // Dispatch the toggle event
        this.dispatchEvent(new CustomEvent('toggle', {
            detail: { expanded: this._isExpanded },
            bubbles: true,
            composed: true
        }));
    }
    
    _toggleExpanded() {
        this._isExpanded = !this._isExpanded;
        
        // Update the expanded attribute
        if (this._isExpanded) {
            this.setAttribute('expanded', '');
        } else {
            this.removeAttribute('expanded');
        }
        
        // Update the UI
        this._updateContentVisibility();
        
        // Dispatch the toggle event
        this.dispatchEvent(new CustomEvent('toggle', {
            detail: { expanded: this._isExpanded },
            bubbles: true,
            composed: true
        }));
    }
    
    _updateContentVisibility() {
        if (!this._content || !this._header) return;
        
        const hideIcon = this.hasAttribute('hide-icon');
        
        if (this._isExpanded) {
            this._content.classList.add('collapsible-item__content--expanded');
            this._content.style.display = 'block';
            this._header.setAttribute('aria-expanded', 'true');
            this.classList.add('collapsible-item--expanded');
            // Update icon to expanded state (down arrow) only if not hidden
            if (!hideIcon) {
                this.setAttribute('icon', '▼');
            }
        } else {
            this._content.classList.remove('collapsible-item__content--expanded');
            this._content.style.display = 'none';
            this._header.setAttribute('aria-expanded', 'false');
            this.classList.remove('collapsible-item--expanded');
            // Update icon to collapsed state (right arrow) only if not hidden
            if (!hideIcon) {
                this.setAttribute('icon', '▶');
            }
        }
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'removeshift') {
            this._removeShift = newValue !== null;
            if (this._removeShift) {
                this.classList.add('collapsible-item--no-padding');
            } else {
                this.classList.remove('collapsible-item--no-padding');
            }
        } else if (name === 'hide-icon' && this._header) {
            // Handle hide-icon attribute changes
            const iconEl = this._header.querySelector('.collapsible-item__icon');
            if (newValue !== null) {
                // hide-icon is set, remove the icon if it exists
                if (iconEl) {
                    iconEl.remove();
                }
            } else if (this.hasAttribute('icon')) {
                // hide-icon is removed, add the icon back if we have an icon attribute
                if (!iconEl) {
                    const icon = this.getAttribute('icon');
                    const newIconEl = document.createElement('span');
                    newIconEl.className = 'collapsible-item__icon';
                    newIconEl.textContent = icon;
                    newIconEl.style.marginRight = '0.5rem';
                    const contentWrapper = this._header.firstElementChild;
                    if (contentWrapper) {
                        contentWrapper.insertBefore(newIconEl, contentWrapper.firstChild);
                    }
                }
            }
        } else if (name === 'expanded') {
            const wasExpanded = this._isExpanded;
            this._isExpanded = newValue !== null;
            
            // Only update if the state actually changed
            if (this._isExpanded !== wasExpanded) {
                this._updateContentVisibility();
            }
        } else if (name === 'icon' && this._header) {
            // Update the icon if it exists, or create it if it doesn't
            let iconEl = this._header.querySelector('.collapsible-item__icon');
            if (newValue) {
                if (!iconEl) {
                    iconEl = document.createElement('span');
                    iconEl.className = 'collapsible-item__icon';
                    this._header.insertBefore(iconEl, this._header.firstChild);
                }
                iconEl.textContent = newValue;
            } else if (iconEl) {
                this._header.removeChild(iconEl);
            }
        } else if (name === 'label' && this._header) {
            // Update the label if it exists, or create it if it doesn't
            let labelEl = this._header.querySelector('.collapsible-item__label');
            if (labelEl) {
                labelEl.textContent = newValue || '';
            } else if (newValue) {
                labelEl = document.createElement('span');
                labelEl.className = 'collapsible-item__label';
                labelEl.textContent = newValue;
                this._header.appendChild(labelEl);
            }
        }
    }
}

// Define the custom element with the correct name
const elementName = 'collapsible-item';

// Check if the element is already defined and undefine it if necessary
if (typeof window !== 'undefined' && window.customElements) {
    // First, try to undefine the element if it exists
    if (window.customElements.get(elementName)) {
        const oldElement = window.customElements.get(elementName);
        delete window.customElements._elements[elementName];
    }
    
    // Define the element with the proper configuration
    window.customElements.define(elementName, CollapsibleItem, { extends: 'li' });
}