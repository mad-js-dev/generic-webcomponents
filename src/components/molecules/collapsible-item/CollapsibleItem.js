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
        return ['expanded', 'icon', 'label', 'removeshift'];
    }
    
    constructor() {
        super();
        this._isExpanded = false;
        this._handleClick = this._handleClick.bind(this);
        this._header = null;
        this._content = null;
        this._initialRender = true;
        this._removeShift = false;
        
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
        if (!this.rendered) {
            this.render();
            this.rendered = true;
            this._addEventListeners();
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
        
        // Find the parent collapsible item
        const collapsibleItem = header.closest('li[is="collapsible-item"]');
        if (!collapsibleItem) return; // Not part of a collapsible item
        
        // Toggle the expanded state
        collapsibleItem.expanded = !collapsibleItem.hasAttribute('expanded');
        
        // Stop propagation to prevent parent items from handling the same click
        event.stopPropagation();
    }
    
    _createHeader() {
        const header = document.createElement('div');
        header.className = 'collapsible-item__header';
        
        // Add icon if provided
        const icon = this.getAttribute('icon');
        if (icon) {
            const iconEl = document.createElement('span');
            iconEl.className = 'collapsible-item__icon';
            iconEl.textContent = icon;
            header.appendChild(iconEl);
        }
        
        // Add label
        const label = this.getAttribute('label') || '';
        const labelEl = document.createElement('span');
        labelEl.className = 'collapsible-item__label';
        labelEl.textContent = label;
        header.appendChild(labelEl);
        
        return header;
    }
    
    _createContent() {
        const content = document.createElement('div');
        content.className = 'collapsible-item__content';
        
        // Clear existing content
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
        
        // Add initial content if it exists
        if (this._initialChildren && this._initialChildren.length > 0) {
            this._initialChildren.forEach(originalChild => {
                if (originalChild.nodeType === Node.ELEMENT_NODE || 
                   (originalChild.nodeType === Node.TEXT_NODE && originalChild.textContent.trim() !== '')) {
                    
                    // For nested collapsible items
                    if (originalChild.nodeType === Node.ELEMENT_NODE && 
                        originalChild.tagName.toLowerCase() === 'li' && 
                        originalChild.hasAttribute('is') && 
                        originalChild.getAttribute('is') === 'collapsible-item') {
                        
                        // Create a new container to hold the HTML
                        const container = document.createElement('div');
                        
                        // Create the HTML for the nested item
                        let html = `<li is="collapsible-item" class="collapsible-item--nested"`;
                        
                        // Add attributes
                        Array.from(originalChild.attributes).forEach(attr => {
                            if (attr.name !== 'is' && attr.name !== 'class') {
                                html += ` ${attr.name}="${attr.value}"`;
                            }
                        });
                        
                        // Add existing classes
                        if (originalChild.className) {
                            html += ` class="${originalChild.className} collapsible-item--nested"`;
                        }
                        
                        // Close the opening tag
                        html += '>';
                        
                        // Add children
                        html += originalChild.innerHTML;
                        
                        // Close the tag
                        html += '</li>';
                        
                        // Set the HTML and get the first child
                        container.innerHTML = html;
                        const newItem = container.firstElementChild;
                        
                        // Append to content
                        content.appendChild(newItem);
                        
                    } else {
                        // For non-collapsible items, just clone and append
                        content.appendChild(originalChild.cloneNode(true));
                    }
                }
            });
        }
        
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
            bubbles: true
        }));
    }
    
    _updateContentVisibility() {
        if (!this._content) return;
        
        if (this._isExpanded) {
            this._content.style.display = 'block';
            this._content.style.padding = '0.5rem 0 0.5rem 1.5rem';
            this._content.style.maxHeight = 'none';
            this.classList.add('collapsible-item--expanded');
        } else {
            this._content.style.display = 'none';
            this.classList.remove('collapsible-item--expanded');
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
            this.render();
        } else if (name === 'expanded') {
            // Update the internal state when the attribute changes
            this._isExpanded = newValue !== null;
            if (this._isExpanded) {
                this.classList.add('collapsible-item--expanded');
            } else {
                this.classList.remove('collapsible-item--expanded');
            }
            this.render();
        }
    }

    render() {
        const label = this.getAttribute('label') || '';
        const icon = this.getAttribute('icon') || '';
        
        // Ensure base classes are set
        this.classList.add('collapsible-item');
        
        // Remove existing event listeners before re-rendering
        this._removeEventListeners();
        
        // Store original children if this is the first render
        if (this._initialRender) {
            this._initialChildren = [];
            // Only store non-header and non-content children
            Array.from(this.children).forEach(child => {
                if (child !== this._header && child !== this._content && 
                    (child.nodeType === Node.ELEMENT_NODE || 
                     (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== ''))) {
                    this._initialChildren.push(child);
                }
            });
            this._initialRender = false;
        }
        
        // Save scroll position if content exists
        let scrollTop = 0;
        if (this._content) {
            scrollTop = this._content.scrollTop;
        }
        
        // Clear existing content while preserving the header and content references
        while (this.firstChild) {
            if (this.firstChild !== this._header && this.firstChild !== this._content) {
                this.removeChild(this.firstChild);
            } else {
                break;
            }
        }
        
        // Create new header and content if they don't exist
        if (!this._header) {
            this._header = this._createHeader();
        }
        if (!this._content) {
            this._content = this._createContent();
        }
        
        // Add header and content to the DOM if they're not already there
        if (!this.contains(this._header)) {
            this.prepend(this._header);
        }
        if (!this.contains(this._content) && this._header.nextSibling) {
            this.insertBefore(this._content, this._header.nextSibling);
        } else if (!this.contains(this._content)) {
            this.appendChild(this._content);
        }
        
        // Add nested class to nested items
        if (this.parentElement && 
            this.parentElement.tagName.toLowerCase() === 'li' && 
            this.parentElement.hasAttribute('is') && 
            this.parentElement.getAttribute('is') === 'collapsible-item') {
            this.classList.add('collapsible-item--nested');
        } else {
            this.classList.remove('collapsible-item--nested');
        }
        
        // Set initial visibility - use a small timeout to ensure DOM is ready
        requestAnimationFrame(() => {
            this._updateContentVisibility();
            
            // Restore scroll position if it was saved
            if (scrollTop > 0) {
                this._content.scrollTop = scrollTop;
            }
        });
        
        // Add elements to the component
        this.appendChild(this._header);
        this.appendChild(this._content);
        
        // Add event listeners after the DOM is updated
        this._addEventListeners();
    }
}

// Define the custom element with the correct name
const elementName = 'collapsible-item';
if (!customElements.get(elementName)) {
    customElements.define(elementName, CollapsibleItem, { extends: 'li' });
}