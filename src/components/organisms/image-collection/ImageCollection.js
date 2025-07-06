import { CollapsibleItem } from '../../molecules/collapsible-item/CollapsibleItem.js';

export class ImageCollection extends HTMLElement {
    static get observedAttributes() {
        return ['images'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._images = [];
        this._handleToggle = this._handleToggle.bind(this);
        this._currentOpenIndex = 0;
    }

    get images() {
        return this._images;
    }

    set images(value) {
        if (Array.isArray(value)) {
            this._images = value;
            this.render();
        } else if (typeof value === 'string') {
            try {
                this._images = JSON.parse(value);
                this.render();
            } catch (e) {
            }
        }
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.addEventListener('toggle', this._handleToggle);
    }

    disconnectedCallback() {
        this.shadowRoot.removeEventListener('toggle', this._handleToggle);
    }

    _handleToggle(event) {
        // Prevent event from bubbling up
        event.stopPropagation();
        
        // Prevent reentrant calls
        if (this._isHandlingToggle) return;
        this._isHandlingToggle = true;
        
        let index = -1;
        let wasExpanded = false;
        
        try {
            
            // Find the clicked collapsible item by traversing up the composed path
            const target = event.composedPath().find(
                node => node.nodeType === Node.ELEMENT_NODE && 
                       node.getAttribute && 
                       node.getAttribute('is') === 'collapsible-item'
            );
            
            if (!target) {
                return;
            }

            // Get all collapsible items
            const allItems = Array.from(this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'));
            index = allItems.indexOf(target);
            
            if (index === -1) {
                return;
            }
            
            // Prevent toggling if this item is already open
            if (index === this._currentOpenIndex) {
                return;
            }
            
            wasExpanded = target.expanded;
            
            // Update all items
            
            // First, close all items except the target
            allItems.forEach((item, i) => {
                if (i !== index && item.expanded) {
                    item.expanded = false;
                }
            });
            
            // Then toggle the target item if needed
            if (index === this._currentOpenIndex) {
                // Clicked the currently open item - close it
                target.expanded = false;
                this._currentOpenIndex = -1;
            } else {
                // Open the clicked item
                target.expanded = true;
                this._currentOpenIndex = index;
            }
        } finally {
            // Always clear the flag, even if an error occurred
            this._isHandlingToggle = false;
        }
        
        // Dispatch our custom event
        this.dispatchEvent(new CustomEvent('toggle', {
            detail: { 
                index,
                expanded: !wasExpanded,
                source: 'image-collection'
            },
            bubbles: true,
            composed: true
        }));
    }

    
    _onItemToggle(event) {
        // Stop propagation to prevent double-handling
        event.stopPropagation();
        
        const targetItem = event.target.closest('li[is="collapsible-item"]');
        if (!targetItem) return;

        const items = Array.from(this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'));
        const index = items.indexOf(targetItem);
        
        if (index === -1) return;

        // If the clicked item is being closed, just update our state
        if (!event.detail.expanded) {
            if (this._currentOpenIndex === index) {
                this._currentOpenIndex = -1;
            }
            return;
        }

        // Close the previously open item if it's different from the clicked one
        if (this._currentOpenIndex !== -1 && this._currentOpenIndex !== index) {
            const previousItem = items[this._currentOpenIndex];
            if (previousItem) {
                previousItem.toggle(false);
            }
        }
        
        this._currentOpenIndex = index;
    }

    render() {
        if (!this.shadowRoot) return;
        
        // Only expand the first item if no item is currently expanded
        if (this._currentOpenIndex === -1 && this._images.length > 0) {
            this._currentOpenIndex = 0;
        }
        
        this.shadowRoot.innerHTML = `
            <style>
                .image-collection {
                    width: 100%;
                    max-width: 800px;
                    margin: 0 auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
                
                .image-collection__container {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    width: 100%;
                    list-style: none;
                    padding: 0;
                }
                
                .image-collection__item {
                    width: 100%;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .image-collection__image {
                    width: 100%;
                    height: auto;
                    display: block;
                }
                
                .image-collection__title {
                    font-weight: 600;
                    padding: 0.8rem 1rem;
                    background-color: #f8fafc;
                    width: 100%;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .image-collection__title:hover {
                    background-color: #f1f5f9;
                }
                
                .image-collection .collapsible-item__header {
                    padding: 0.5rem 1rem;
                    background: none;
                    border: none;
                    width: 100%;
                    text-align: left;
                    cursor: pointer;
                }
                
                .image-collection .collapsible-item__content {
                    margin: 0;
                    transition: all 0.3s ease;
                }
                
                .image-collection li[is="collapsible-item"] {
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .image-collection li[is="collapsible-item"]:last-child {
                    margin-bottom: 0;
                }
            </style>
            <div class="image-collection">
                <ul class="image-collection__container">
                    ${this._images.map((image, index) => `
                        <li is="collapsible-item" 
                            label="${image.title}" 
                            ${image.removeshift ? 'removeshift="true"' : ''}
                            ${this._currentOpenIndex === index ? 'expanded' : ''}
                            hide-icon
                            >
                            <div slot="content">
                                <img 
                                    class="image-collection__image" 
                                    src="${image.src}" 
                                    alt="${image.title}"
                                    loading="lazy"
                                >
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
}

if (!customElements.get('image-collection')) {
    customElements.define('image-collection', ImageCollection);
}