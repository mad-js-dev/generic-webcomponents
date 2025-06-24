/**
 * ImageCollection Component
 * A custom element that displays a collection of images in a collapsible list
 */

export class ImageCollection extends HTMLElement {
  static get observedAttributes() {
    return ['images', 'no-animation'];
  }
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._images = [];
    this._hasRendered = false;
    this._handleItemClick = this._handleItemClick.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleToggle = this._handleToggle.bind(this);
    this._currentOpenItem = null;
    this._initialized = false;
    this._lastOpenedIndex = -1;
    this._mutationObserver = null;
    this._intersectionObserver = null;
    this._preloadedImages = new Map(); // Cache for preloaded images
    this._visibleIndices = new Set(); // Track visible items
    this._preloadDistance = 2; // Number of items to preload around visible ones
    this._isInitialLoad = true; // Track if this is the first load
  }
  
  get images() {
    return this._images;
  }
  
  set images(value) {
    if (Array.isArray(value)) {
      this._images = value;
      this._preloadImages(); // Preload when images are set
      this._render();
    } else if (typeof value === 'string') {
      try {
        this._images = JSON.parse(value);
        this._preloadImages(); // Preload when images are set via string
        this._render();
      } catch (e) {
        console.error('Invalid images data format', e);
      }
    }
  }
  
  connectedCallback() {
    if (!this._initialized) {
      this._initialized = true;
      let isInitialRender = true;
      this._render();
      
      // After the first render, set up the initial load state
      if (isInitialRender) {
        this._isInitialLoad = true;
        // Set initial height for all containers
        const containers = this.shadowRoot.querySelectorAll('.image-container');
        containers.forEach(container => {
          container.style.height = '300px';
        });
        
        // Add initial load class for first render if not using no-animation
        if (!this.hasAttribute('no-animation')) {
          this.classList.add('initial-load');
        } else {
          // If no-animation is set, ensure images are immediately visible
          const images = this.shadowRoot.querySelectorAll('.image-collection__image');
          images.forEach(img => img.classList.add('loaded'));
        }
      }
      
      // Add event listeners after initial render
      this._addEventListeners();
      
      // Set up mutation observer
      this._setupMutationObserver();
      
      // Preload all images immediately
      this.preloadAllImages();
      
      // Set the first item as expanded by default if none is expanded
      if (!this._hasExpandedItem()) {
        this._setFirstItemExpanded();
      }
    }
  }
  
  _addEventListeners() {
    // Handle toggle events from collapsible items
    this.addEventListener('toggle', (e) => {
      // Only handle events from direct children
      const item = e.target;
      if (item.parentElement !== this.shadowRoot.querySelector('collapsible-list')) {
        return;
      }
      
      // If an item is being expanded, close all others
      if (e.detail.expanded) {
        this._closeOtherItems(item);
        
        // Dispatch a custom event
        const items = Array.from(this.shadowRoot.querySelectorAll('collapsible-item'));
        this.dispatchEvent(new CustomEvent('item-selected', {
          detail: { 
            index: items.indexOf(item),
            item: item
          },
          bubbles: true,
          composed: true
        }));
      }
    });
    
    // Handle keyboard navigation
    this.addEventListener('keydown', (e) => {
      const items = Array.from(this.shadowRoot.querySelectorAll('collapsible-item'));
      const currentIndex = items.findIndex(item => item === document.activeElement.closest('collapsible-item'));
      
      if (currentIndex === -1) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex].focus();
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex].focus();
          break;
          
        case 'Home':
          e.preventDefault();
          items[0].focus();
          break;
          
        case 'End':
          e.preventDefault();
          items[items.length - 1].focus();
          break;
          
        case 'Enter':
        case ' ':
          e.preventDefault();
          // Only expand if not already expanded (prevents closing)
          if (!items[currentIndex].expanded) {
            items[currentIndex].click();
          }
          break;
      }
    });
  }
  
  _closeOtherItems(selectedItem) {
    if (!this.shadowRoot) return;
    const items = Array.from(this.shadowRoot.querySelectorAll('collapsible-item'));
    const selectedIndex = items.indexOf(selectedItem);
    
    // Update our internal state
    this._lastOpenedIndex = selectedIndex;
    this._currentOpenItem = selectedItem;
    
    // Close all other items
    items.forEach(item => {
      if (item !== selectedItem) {
        item.expanded = false;
      }
    });
    
    // Ensure the selected item is expanded
    if (selectedItem) {
      selectedItem.expanded = true;
      this.dispatchEvent(new CustomEvent('item-selected', {
        detail: { index: selectedIndex, item: selectedItem },
        bubbles: true,
        composed: true
      }));
    }
  }
  
  _hasExpandedItem() {
    if (!this.shadowRoot) return false;
    const items = this.shadowRoot.querySelectorAll('collapsible-item');
    return Array.from(items).some(item => item && item.expanded);
  }
  
  _setFirstItemExpanded() {
    // Use requestAnimationFrame to ensure the shadow DOM is ready
    requestAnimationFrame(() => {
      const items = this.shadowRoot?.querySelectorAll('collapsible-item');
      if (items && items.length > 0) {
        // Only set first item as expanded if no item is currently open
        if (this._lastOpenedIndex === -1) {
          items[0].expanded = true;
          this._currentOpenItem = items[0];
          this._lastOpenedIndex = 0;
        }
      }
    });
  }
  
  _handleItemClick(e) {
    // Stop any immediate propagation to prevent other handlers
    e.stopImmediatePropagation();
    
    const targetItem = e.target.closest('collapsible-item');
    if (!targetItem) return false;
    
    // Prevent default to take full control of the toggle behavior
    e.preventDefault();
    
    // If clicking the currently open item, do nothing (keep it open)
    if (targetItem === this._currentOpenItem) {
      return false;
    }
    
    // For other items, close all others and open the clicked one
    this._closeOtherItems(targetItem);
    
    // Ensure the target item is expanded
    targetItem.expanded = true;
    
    // Update our internal state
    const items = Array.from(this.shadowRoot.querySelectorAll('collapsible-item'));
    this._currentOpenItem = targetItem;
    this._lastOpenedIndex = items.indexOf(targetItem);
    
    // Dispatch item-selected event
    this.dispatchEvent(new CustomEvent('item-selected', {
      detail: { 
        index: this._lastOpenedIndex,
        item: targetItem 
      },
      bubbles: true,
      composed: true
    }));
    
    return false;
  }
  
  /**
   * Sets up intersection observer for lazy loading
   * @private
   */
  _setupIntersectionObserver() {
    // Not needed anymore since we're preloading all images
    // But kept for backward compatibility
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = null;
    }
  }
  
  _observeItems() {
    // Not needed anymore since we're preloading all images
    // But kept for backward compatibility
  }
  
  disconnectedCallback() {
    // Clean up event listeners
    const items = Array.from(this.shadowRoot.querySelectorAll('collapsible-item'));
    items.forEach(item => {
      item.removeEventListener('click', this._handleItemClick);
      item.removeEventListener('toggle', this._handleToggle);
    });
    
    // Disconnect observers
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }
    
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = null;
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'images' && oldValue !== newValue) {
      this.images = newValue;
    }
  }
  
  _setupEventListeners() {
    const items = Array.from(this.shadowRoot.querySelectorAll('collapsible-item'));
    
    items.forEach((item, index) => {
      // Remove any existing click handlers to prevent duplicates
      item.removeEventListener('click', this._handleItemClick);
      item.removeEventListener('keydown', this._handleKeyDown);
      item.removeEventListener('toggle', this._handleToggle);
      
      // Store a reference to the original click handler
      if (!item._originalClickHandler) {
        item._originalClickHandler = item._onClick;
      }
      
      // Override the click handler to prevent closing the open item
      item._onClick = (e) => {
        if (item === this._currentOpenItem) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        return item._originalClickHandler?.call(item, e);
      };
      
      // Add our custom handlers
      item.addEventListener('click', this._handleItemClick, { capture: true });
      item.addEventListener('keydown', this._handleKeyDown, { capture: true });
      item.addEventListener('toggle', this._handleToggle, { capture: true });
      
      // Make items keyboard accessible
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
    });
    
    this._hasRendered = true;
  }
  
  _setupMutationObserver() {
    // Set up mutation observer to watch for changes in the DOM
    this._mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // If items were added or removed, update event listeners
          this._setupEventListeners();
        }
      });
    });
    
    // Start observing the shadow root for changes
    this._mutationObserver.observe(this.shadowRoot, {
      childList: true,
      subtree: true
    });
  }
  
  _handleToggle(e) {
    // We don't need to handle the toggle event directly anymore
    // as we're handling everything in _handleItemClick
    e.stopPropagation();
    
    // Prevent the default toggle behavior since we're handling it in _handleItemClick
    e.preventDefault();
    return false;
  }
  
  _handleKeyDown(e) {
    // Handle keyboard navigation (Enter or Space to toggle)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleItemClick(e);
    }
    // Handle arrow keys for navigation
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = Array.from(this.shadowRoot.querySelectorAll('collapsible-item'));
      const currentIndex = items.indexOf(e.target);
      let nextIndex;
      
      if (e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % items.length;
      } else {
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      }
      
      const nextItem = items[nextIndex];
      if (nextItem) {
        nextItem.focus();
        nextItem.click();
      }
    }
  }
  
  // Public method to get the index of the currently open item
  getOpenItemIndex() {
    return this._lastOpenedIndex;
  }

  // Public method to open a specific item by index
  _closeOtherItems(selectedItem) {
    if (!this.shadowRoot) return;
    
    const items = Array.from(this.shadowRoot.querySelectorAll('collapsible-item'));
    const selectedIndex = items.indexOf(selectedItem);
    
    // If clicking the currently open item, do nothing
    if (selectedItem === this._currentOpenItem) {
      // Force the item to stay open
      if (!selectedItem.expanded) {
        selectedItem.expanded = true;
      }
      return;
    }
    
    // Close all items except the selected one
    items.forEach((item, index) => {
      if (index !== selectedIndex) {
        item.expanded = false;
      } else {
        // Ensure the selected item is expanded
        item.expanded = true;
        this._currentOpenItem = item;
        this._lastOpenedIndex = selectedIndex;
      }
    });
    
    // Dispatch item-selected event
    this.dispatchEvent(new CustomEvent('item-selected', {
      detail: { index: selectedIndex, item: selectedItem },
      bubbles: true,
      composed: true
    }));
  }
  
  /**
   * Forces preloading of all images
   * @public
   */
  preloadAllImages() {
    if (!this._images || !Array.isArray(this._images)) return;
    
    console.log('Preloading all images:', this._images.length);
    
    // Load all images in sequence with a small delay to prevent UI blocking
    this._images.forEach((img, index) => {
      if (img && img.src) {
        // Small delay to prevent UI blocking
        setTimeout(() => {
          if (!this._preloadedImages.has(img.src) || 
              this._preloadedImages.get(img.src).status === 'error') {
            this._loadImage(img, index, false);
          }
        }, index * 50); // 50ms delay between each image load
      }
    });
  }
  
  /**
   * Gets the preload status of an image
   * @param {number} index - Index of the image
   * @returns {string} - Status of the image ('loading', 'loaded', 'error', or undefined if not found)
   * @public
   */
  getImageStatus(index) {
    if (!this._images || !this._images[index] || !this._images[index].src) {
      return undefined;
    }
    const status = this._preloadedImages.get(this._images[index].src);
    return status ? status.status : undefined;
  }
  
  // Public method to open a specific item by index
  openItem(index) {
    if (!this.shadowRoot) return;
    
    const items = Array.from(this.shadowRoot.querySelectorAll('collapsible-item'));
    if (index >= 0 && index < items.length) {
      // If clicking the currently open item, do nothing
      if (items[index] === this._currentOpenItem) {
        return;
      }
      
      // Close all items first
      items.forEach(item => {
        item.expanded = false;
      });
      
      // Open the selected item
      items[index].expanded = true;
      this._currentOpenItem = items[index];
      this._lastOpenedIndex = index;
      
      // Dispatch event
      this.dispatchEvent(new CustomEvent('item-selected', {
        detail: { 
          index: index,
          item: items[index]
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  /**
   * Preloads all images in the collection
   * @param {number} [priorityIndex] - Optional index to load first
   */
  _preloadImages(priorityIndex = null) {
    if (!this._images || !Array.isArray(this._images)) return;
    
    // If we have a priority index, load it first
    if (priorityIndex !== null && this._images[priorityIndex]) {
      this._loadImage(this._images[priorityIndex], priorityIndex, true);
    }
    
    // Then load all other images
    this._images.forEach((img, index) => {
      // Skip the priority index if it was already loaded
      if (priorityIndex !== null && index === priorityIndex) return;
      
      // Only load if not already loaded or loading
      const imgSrc = img.src;
      if (!this._preloadedImages.has(imgSrc) || this._preloadedImages.get(imgSrc).status === 'error') {
        this._loadImage(img, index, false);
      }
    });
  }

  /**
   * Loads a single image
   * @private
   */
  _loadImage(imageData, index, isPriority = false) {
    if (!imageData || !imageData.src) {
      console.warn('No image data or src provided');
      return;
    }
    
    let imgSrc = imageData.src;
    
    // Ensure absolute URL for local files
    if (!imgSrc.startsWith('http') && !imgSrc.startsWith('data:') && !imgSrc.startsWith('/')) {
      imgSrc = `/${imgSrc}`;
    }
    
    console.log(`Attempting to load image [${index}]: ${imgSrc}`, { isPriority });
    
    // Skip if already loaded or loading, unless it's a priority load
    if (this._preloadedImages.has(imgSrc)) {
      const status = this._preloadedImages.get(imgSrc).status;
      if ((status === 'loaded' || status === 'loading') && !isPriority) {
        console.log(`Image already ${status}: ${imgSrc}`);
        return;
      }
    }
    
    // Mark as loading
    this._preloadedImages.set(imgSrc, { status: 'loading' });
    
    // Create a transparent 1x1 pixel data URL as initial src to prevent broken image icon
    const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    this._updateImageInDOM(imgSrc, transparentPixel, false);
    
    const img = new Image();
    
    // Set up loading state
    img.onload = () => {
      console.log(`Image loaded successfully: ${imgSrc}`);
      this._preloadedImages.set(imgSrc, { 
        status: 'loaded',
        element: img,
        width: img.width,
        height: img.height
      });
      
      // Update the image in the DOM with the actual image
      this._updateImageInDOM(imgSrc, imgSrc);
    };
    
    img.onerror = (e) => {
      console.error(`Error loading image: ${imgSrc}`, e);
      this._preloadedImages.set(imgSrc, { 
        status: 'error',
        error: e 
      });
      
      // Show error state in the DOM without showing broken image icon
      this._updateImageInDOM(imgSrc, transparentPixel, true);
    };
    
    // Start loading the actual image
    img.src = imgSrc;
  }
  
  /**
   * Updates an image in the DOM when it's loaded
   * @private
   */
  _updateImageInDOM(src, newSrc, isError = false) {
    if (!this.shadowRoot) {
      console.warn('No shadow root available');
      return;
    }
    
    console.log(`Updating image in DOM: ${src}`, { newSrc, isError });
    
    // First, try to find by exact data-index match if we have it
    let images = [];
    const allImages = Array.from(this.shadowRoot.querySelectorAll('img[data-src]'));
    
    // Try exact match first
    images = allImages.filter(img => {
      const dataSrc = img.getAttribute('data-src');
      return dataSrc && (dataSrc === src || dataSrc.endsWith(`/${src}`) || dataSrc.endsWith(src));
    });
    
    // If not found, try with just the filename
    if (images.length === 0) {
      const filename = src.split('/').pop();
      images = allImages.filter(img => {
        const dataSrc = img.getAttribute('data-src');
        return dataSrc && dataSrc.endsWith(filename);
      });
      console.log(`Trying to find by filename ${filename}, found:`, images.length);
    }
    
    // If still not found, try any image that contains the filename
    if (images.length === 0) {
      const filename = src.split('/').pop();
      images = allImages.filter(img => {
        const dataSrc = img.getAttribute('data-src');
        return dataSrc && dataSrc.includes(filename);
      });
      console.log(`Trying to find by partial filename ${filename}, found:`, images.length);
    }
    
    // If still not found, try to find by index
    if (images.length === 0) {
      const allImagesWithIndex = Array.from(this.shadowRoot.querySelectorAll('img'));
      const index = this._images.findIndex(img => img && img.src === src);
      if (index >= 0 && index < allImagesWithIndex.length) {
        images = [allImagesWithIndex[index]];
      }
    }
    
    // If no images found, try to find by src attribute directly
    if (images.length === 0) {
      images = Array.from(this.shadowRoot.querySelectorAll(`img[src="${src}"]`));
    }
    
    // Get the image info to check if it's an initial load
    const imageInfo = this._preloadedImages.get(src);
    const isInitialLoad = this._isInitialLoad && (!imageInfo || imageInfo.isInitialLoad !== false);
    
    images.forEach(img => {
      if (isError) {
        // Add error class and set a placeholder
        img.classList.add('image-error');
        img.alt = 'Failed to load image';
        img.classList.remove('loading');
      } else if (newSrc) {
        console.log(`Updating image source: ${newSrc}`, { isInitialLoad });
        
        // Update the image source
        img.src = newSrc;
        img.removeAttribute('data-src');
        
        // For initial load, use opacity transition
        if (isInitialLoad) {
          // Let CSS handle the opacity transition
          img.classList.add('loaded');
          
          // Mark this image as no longer in initial load
          if (imageInfo) {
            imageInfo.isInitialLoad = false;
          }
        } else {
          // For subsequent loads, use height animation
          const container = img.closest('.image-container');
          if (container) {
            const startHeight = container.offsetHeight;
            container.style.height = `${startHeight}px`;
            container.style.transition = 'height 0.3s ease-in-out';
            
            // Force reflow to ensure the transition works
            void container.offsetHeight;
            
            // Set final height
            container.style.height = 'auto';
            const endHeight = container.offsetHeight;
            container.style.height = `${startHeight}px`;
            
            // Animate to final height
            requestAnimationFrame(() => {
              img.classList.add('loaded');
              container.style.height = `${endHeight}px`;
            });
            
            // Clean up after animation
            container.addEventListener('transitionend', function onEnd() {
              container.style.height = '';
              container.style.transition = '';
              container.removeEventListener('transitionend', onEnd);
            });
          } else {
            img.classList.add('loaded');
          }
        }
      }
      
      // Remove the loader if it exists
      const loader = img.nextElementSibling;
      if (loader && loader.classList.contains('image-loader')) {
        loader.remove();
      }
    });
  }
  
  _render() {
    if (!this.shadowRoot) return;
    
    // Save the current open index before re-rendering
    const previousOpenIndex = this._lastOpenedIndex;
    const isInitialRender = !this._hasRendered;
    const noAnimation = this.hasAttribute('no-animation');
    
    // Create the styles
    const style = `
      <style>
        .image-collection {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          max-width: 100%;
          margin: 0 auto;
        }
        
        .image-container {
          position: relative;
          width: 100%;
          height: 300px;
          min-height: 300px;
          overflow: hidden;
          contain: content;
          will-change: height;
        }
        
        .image-collection__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease-in-out, height 0.3s ease-in-out;
          opacity: 0;
        }
        
        :host([no-animation]) .image-collection__image {
          opacity: 1;
          transition: none;
        }
        
        /* Initial load - use opacity transition */
        .initial-load .image-container {
          height: 300px !important;
          transition: none !important;
        }
        
        .initial-load .image-collection__image {
          height: 100%;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        
        .initial-load .image-collection__image.loaded {
          opacity: 1;
        }
        
        /* Subsequent loads - use height transition */
        .image-collection__image.loaded {
          opacity: 1;
          height: 100%;
        }
        
        .image-collection__image.image-error {
          opacity: 1;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-style: italic;
        }
        
        .image-loader {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-style: italic;
        }
        
        .image-collection__image.loaded + .image-loader {
          display: none;
        }
        
        .image-collection__title {
          margin: 0;
          padding: 0.8rem 1rem;
          color: #333;
          font-size: 0.8em;
          font-weight: 600;
          background: rgba(0,0,0,0.4);
          color: white;
          transition: all 0.2s ease;
          position: relative;
          z-index: 1;
          line-height: 1.2;
          border: none;
          display: block;
          width: 100%;
          text-align: left;
          color: white;
          position: absolute;
          top: 0;
        }

        
        collapsible-item {
          cursor: pointer;
          transition: background-color 0.2s;
          border: none;
          margin: 0;
          padding: 0;
          overflow: hidden;
          display: block;
          min-height: 45px;
          position: relative;
        }
        
        collapsible-item:not(:last-child) .image-collection__title {
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        @keyframes fadeIn {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
      </style>
    `;
    
    // Create the HTML for each image item
    const items = this._images.map((image, index) => {
      // Ensure the image path is correct - prepend public path if it's a relative path
      let imageSrc = image.src;
      if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('data:')) {
        // Ensure there's exactly one leading slash
        imageSrc = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
      }
      
      // Check if image is already loaded
      const isLoaded = this._preloadedImages.has(imageSrc) && 
                      this._preloadedImages.get(imageSrc).status === 'loaded';
      const isLoading = this._preloadedImages.has(imageSrc) && 
                       this._preloadedImages.get(imageSrc).status === 'loading';
      
      const imgClasses = ['image-collection__image'];
      if (isLoaded) {
        imgClasses.push('loaded');
      } else if (isLoading) {
        imgClasses.push('loading');
      }
      
      return `
        <collapsible-item hide-icon data-index="${index}">
          <div class="image-container">
            <img
              ${isLoaded ? `src="${imageSrc}"` : `src="" data-src="${imageSrc}"`}
              alt="${image.alt || image.title || 'Image'}"
              class="${imgClasses.join(' ')}"
              loading="lazy"
              onerror="this.onerror=null;this.classList.add('image-error');"
            />
            ${!isLoaded ? '<div class="image-loader">Loading...</div>' : ''}
          </div>
          <div slot="header" class="image-collection__title">${image.title || `Image ${index + 1}`}</div>
          ${image.description ? `<div slot="content">${image.description}</div>` : ''}
        </collapsible-item>
      `;
    }).join('');
    
    // Combine everything into the final template
    const template = `
      ${style}
      <div class="image-collection">
        <collapsible-list>
          ${items}
        </collapsible-list>
      </div>
    `;
    
    // Set the inner HTML
    this.shadowRoot.innerHTML = template;
    
    // Set initial height for all containers on initial render
    if (isInitialRender) {
      const containers = this.shadowRoot.querySelectorAll('.image-container');
      containers.forEach(container => {
        container.style.height = '300px';
      });
    }
    
    // Set up intersection observer for lazy loading
    if (!this._intersectionObserver) {
      this._setupIntersectionObserver();
    }
    
    // Setup event listeners
    this._setupEventListeners();
    
    // Restore the previously open item if it exists
    if (previousOpenIndex >= 0) {
      this.openItem(previousOpenIndex);
    } else if (this._images.length > 0) {
      // Otherwise, open the first item by default
      this.openItem(0);
    }
    
    // Start loading visible images
    this._preloadImages();
    
    // Mark as rendered
    this._hasRendered = true;
    
    // Load components and setup event listeners
    return Promise.all([
      customElements.get('collapsible-list') || 
        import('../../molecules/collapsible-list/CollapsibleList.js'),
      customElements.get('collapsible-item') || 
        import('../../atoms/collapsible-item/CollapsibleItem.js')
    ]).then(() => {
      this._setupEventListeners();
      
      // After components are loaded and event listeners are set up
      const items = Array.from(this.shadowRoot.querySelectorAll('collapsible-item'));
      
      if (items.length > 0) {
        // If we had an item open before, try to restore its state
        if (previousOpenIndex !== -1 && previousOpenIndex < items.length) {
          items[previousOpenIndex].expanded = true;
          this._currentOpenItem = items[previousOpenIndex];
          this._lastOpenedIndex = previousOpenIndex;
        } 
        // If this is the first render and we have images, open the first one
        else if (isInitialRender && this._images.length > 0 && previousOpenIndex === -1) {
          this._lastOpenedIndex = 0;
          
          // If no-animation is set, immediately update the DOM without transitions
          if (noAnimation) {
            const items = this.shadowRoot.querySelectorAll('collapsible-item');
            if (items.length > 0) {
              items[0].expanded = true;
              this._currentOpenItem = items[0];
            }
          }
        }
      }
      
      this._hasRendered = true;
    });
  }
}

// Define the custom element
if (!customElements.get('image-collection')) {
  customElements.define('image-collection', ImageCollection);
}
