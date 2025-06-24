/**
 * ProductLayout
 * A layout component that displays an image collection, title, and content
 */
// Import the image-collection component
import '../../organisms/image-collection/ImageCollection';

export class ProductLayout extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'images'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._title = '';
    this._images = [];
    this._isConnected = false;
    this._hasRendered = false;
    this._isUpdating = false; // Flag to prevent re-entrant calls
    this._elements = null;
    this._render = this._render.bind(this);
  }

  get title() {
    return this._title;
  }

  set title(value) {
    const newValue = value || '';
    if (this._title !== newValue) {
      this._title = newValue;
      if (this._isConnected) {
        this._updateTitle();
      }
    }
  }

  get images() {
    return this._images;
  }

  set images(value) {
    let newImages = [];
    
    if (typeof value === 'string') {
      try {
        newImages = value ? JSON.parse(value) : [];
      } catch (e) {
        console.error('Invalid images data format', e);
        newImages = [];
      }
    } else if (Array.isArray(value)) {
      newImages = [...value];
    }
    
    // Only update if the images have actually changed
    const imagesChanged = JSON.stringify(this._images) !== JSON.stringify(newImages);
    this._images = newImages;
    
    if (imagesChanged && this._isConnected) {
      this._updateImages();
    }
  }

  connectedCallback() {
    if (this._isConnected) return;
    this._isConnected = true;
    
    // Initialize from attributes
    if (this.hasAttribute('title')) {
      this._title = this.getAttribute('title');
    }
    
    if (this.hasAttribute('images')) {
      try {
        this._images = JSON.parse(this.getAttribute('images') || '[]');
      } catch (e) {
        console.error('Invalid initial images data', e);
        this._images = [];
      }
    }
    
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'title':
        this.title = newValue;
        break;
      case 'images':
        this.images = newValue;
        break;
    }
  }

  _renderImageCollection() {
    if (!this._images || this._images.length === 0) return '';
    
    // Ensure images is an array
    const images = Array.isArray(this._images) ? this._images : [];
    
    // Create an image-collection element with the images and no-animation attribute
    return `
      <div>
        <image-collection 
          images='${JSON.stringify(images)}'
          style="--image-height: 400px;"
          no-animation
        ></image-collection>
      </div>
    `;
  }

  // Cache DOM elements after first render
  _cacheElements() {
    if (!this.shadowRoot) return;
    
    this._elements = {
      title: this.shadowRoot.querySelector('.header h2'),
      imageContainer: this.shadowRoot.querySelector('.image-collection-container'),
      header: this.shadowRoot.querySelector('.header'),
      content: this.shadowRoot.querySelector('.content')
    };
  }

  _updateTitle() {
    if (!this.shadowRoot) return;
    
    if (this._elements?.title) {
      this._elements.title.textContent = this._title;
    } else if (this._isConnected) {
      this._render();
    }
  }

  _updateImages() {
    if (this._isUpdating || !this.shadowRoot || !this._isConnected) return;
    
    this._isUpdating = true;
    try {
      const imageCollection = this.shadowRoot.querySelector('image-collection');
      if (imageCollection) {
        // Update existing image collection
        const currentImages = imageCollection.getAttribute('images');
        const newImages = JSON.stringify(this._images);
        if (currentImages !== newImages) {
          imageCollection.setAttribute('images', newImages);
        }
      } else if (this._elements?.imageContainer) {
        // Re-render just the image container if it exists
        this._elements.imageContainer.innerHTML = this._renderImageCollection();
      } else if (!this._hasRendered) {
        // Only do full render if we haven't rendered yet
        this._render();
      }
    } finally {
      this._isUpdating = false;
    }
  }

  _render() {
    if (this._isUpdating || !this.shadowRoot || !this._isConnected) return;
    
    this._isUpdating = true;
    try {
      // Only set innerHTML on first render
      if (!this._hasRendered) {
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          --primary-color: #00f0ff;
          --text-color: #e0e0e0;
          --text-secondary: #8f9bb3;
          --border-color: #2a2a3a;
          --bg-color: #1a1a2e;
        }
        
        
        .image-collection-container {
          width: 100%;
          position: relative;
          border-radius: 8px;
          background-color: #1a1a1a;
          margin-bottom: 0;
          overflow: hidden;
        }
        
        .header {
          padding: 1rem 0;
        }
        
        .header h2 {
          margin: 0;
          color: var(--text-color);
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .divider {
          border: none;
          height: 1px;
          background-color: white;
          margin: 0;
        }
        
        .content {
          padding: 0;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        ::slotted(.vehicle-description) {
          color: var(--text-secondary);
          line-height: 1.7;
        }
        
        ::slotted(.vehicle-specs) {
          margin-top: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
        }
        
        ::slotted(.vehicle-specs h3) {
          color: var(--primary-color);
          margin-top: 0;
          margin-bottom: 1.25rem;
          font-size: 1.25rem;
          font-weight: 600;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
        }
        
        ::slotted(.vehicle-specs ul) {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 0.75rem;
        }
        
        ::slotted(.vehicle-specs li) {
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          border-left: 3px solid var(--primary-color);
          transition: var(--transition, all 0.3s ease);
        }
        
        ::slotted(.vehicle-specs li:hover) {
          background: rgba(0, 240, 255, 0.1);
          transform: translateX(4px);
        }
        
        ::slotted(.vehicle-specs strong) {
          color: var(--primary-color);
          margin-right: 0.5rem;
          font-weight: 500;
        }
      </style>
      <div class="product-layout">
        ${this._images.length > 0 ? `
          <div class="image-collection-container">
            ${this._renderImageCollection()}
          </div>
        ` : ''}
        
        <div class="header">
          <div class="divider"></div>
          <h2>${this._title}</h2>
        </div>
        
        <div class="content">
          <slot name="content"></slot>
        </div>
      </div>`;
      
        this._hasRendered = true;
        this._cacheElements();
      } else if (!this._isUpdating) {
        // On subsequent renders, only update what's needed
        this._updateTitle();
        this._updateImages();
      }
    } finally {
      this._isUpdating = false;
    }
  }
}

// Auto-register the component when loaded directly
if (typeof window !== 'undefined' && !customElements.get('product-layout')) {
  customElements.define('product-layout', ProductLayout);
}
