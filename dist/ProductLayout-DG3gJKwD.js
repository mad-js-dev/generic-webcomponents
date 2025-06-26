class ImageCollection extends HTMLElement {
  static get observedAttributes() {
    return ["images", "no-animation"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
    this._preloadedImages = /* @__PURE__ */ new Map();
    this._visibleIndices = /* @__PURE__ */ new Set();
    this._preloadDistance = 2;
    this._isInitialLoad = true;
  }
  get images() {
    return this._images;
  }
  set images(value) {
    if (Array.isArray(value)) {
      this._images = value;
      this._preloadImages();
      this._render();
    } else if (typeof value === "string") {
      try {
        this._images = JSON.parse(value);
        this._preloadImages();
        this._render();
      } catch (e) {
        console.error("Invalid images data format", e);
      }
    }
  }
  connectedCallback() {
    if (!this._initialized) {
      this._initialized = true;
      this._render();
      {
        this._isInitialLoad = true;
        const containers = this.shadowRoot.querySelectorAll(".image-container");
        containers.forEach((container) => {
          container.style.height = "300px";
        });
        if (!this.hasAttribute("no-animation")) {
          this.classList.add("initial-load");
        } else {
          const images = this.shadowRoot.querySelectorAll(".image-collection__image");
          images.forEach((img) => img.classList.add("loaded"));
        }
      }
      this._addEventListeners();
      this._setupMutationObserver();
      this.preloadAllImages();
      if (!this._hasExpandedItem()) {
        this._setFirstItemExpanded();
      }
    }
  }
  _addEventListeners() {
    this.addEventListener("toggle", (e) => {
      const item = e.target;
      if (item.parentElement !== this.shadowRoot.querySelector("collapsible-list")) {
        return;
      }
      if (e.detail.expanded) {
        this._closeOtherItems(item);
        const items = Array.from(this.shadowRoot.querySelectorAll("collapsible-item"));
        this.dispatchEvent(new CustomEvent("item-selected", {
          detail: {
            index: items.indexOf(item),
            item
          },
          bubbles: true,
          composed: true
        }));
      }
    });
    this.addEventListener("keydown", (e) => {
      const items = Array.from(this.shadowRoot.querySelectorAll("collapsible-item"));
      const currentIndex = items.findIndex((item) => item === document.activeElement.closest("collapsible-item"));
      if (currentIndex === -1) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex].focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex].focus();
          break;
        case "Home":
          e.preventDefault();
          items[0].focus();
          break;
        case "End":
          e.preventDefault();
          items[items.length - 1].focus();
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (!items[currentIndex].expanded) {
            items[currentIndex].click();
          }
          break;
      }
    });
  }
  _closeOtherItems(selectedItem) {
    if (!this.shadowRoot) return;
    const items = Array.from(this.shadowRoot.querySelectorAll("collapsible-item"));
    const selectedIndex = items.indexOf(selectedItem);
    this._lastOpenedIndex = selectedIndex;
    this._currentOpenItem = selectedItem;
    items.forEach((item) => {
      if (item !== selectedItem) {
        item.expanded = false;
      }
    });
    if (selectedItem) {
      selectedItem.expanded = true;
      this.dispatchEvent(new CustomEvent("item-selected", {
        detail: { index: selectedIndex, item: selectedItem },
        bubbles: true,
        composed: true
      }));
    }
  }
  _hasExpandedItem() {
    if (!this.shadowRoot) return false;
    const items = this.shadowRoot.querySelectorAll("collapsible-item");
    return Array.from(items).some((item) => item && item.expanded);
  }
  _setFirstItemExpanded() {
    requestAnimationFrame(() => {
      var _a;
      const items = (_a = this.shadowRoot) == null ? void 0 : _a.querySelectorAll("collapsible-item");
      if (items && items.length > 0) {
        if (this._lastOpenedIndex === -1) {
          items[0].expanded = true;
          this._currentOpenItem = items[0];
          this._lastOpenedIndex = 0;
        }
      }
    });
  }
  _handleItemClick(e) {
    e.stopImmediatePropagation();
    const targetItem = e.target.closest("collapsible-item");
    if (!targetItem) return false;
    e.preventDefault();
    if (targetItem === this._currentOpenItem) {
      return false;
    }
    this._closeOtherItems(targetItem);
    targetItem.expanded = true;
    const items = Array.from(this.shadowRoot.querySelectorAll("collapsible-item"));
    this._currentOpenItem = targetItem;
    this._lastOpenedIndex = items.indexOf(targetItem);
    this.dispatchEvent(new CustomEvent("item-selected", {
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
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = null;
    }
  }
  _observeItems() {
  }
  disconnectedCallback() {
    const items = Array.from(this.shadowRoot.querySelectorAll("collapsible-item"));
    items.forEach((item) => {
      item.removeEventListener("click", this._handleItemClick);
      item.removeEventListener("toggle", this._handleToggle);
    });
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
    if (name === "images" && oldValue !== newValue) {
      this.images = newValue;
    }
  }
  _setupEventListeners() {
    const items = Array.from(this.shadowRoot.querySelectorAll("collapsible-item"));
    items.forEach((item, index) => {
      item.removeEventListener("click", this._handleItemClick);
      item.removeEventListener("keydown", this._handleKeyDown);
      item.removeEventListener("toggle", this._handleToggle);
      if (!item._originalClickHandler) {
        item._originalClickHandler = item._onClick;
      }
      item._onClick = (e) => {
        var _a;
        if (item === this._currentOpenItem) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        return (_a = item._originalClickHandler) == null ? void 0 : _a.call(item, e);
      };
      item.addEventListener("click", this._handleItemClick, { capture: true });
      item.addEventListener("keydown", this._handleKeyDown, { capture: true });
      item.addEventListener("toggle", this._handleToggle, { capture: true });
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
    });
    this._hasRendered = true;
  }
  _setupMutationObserver() {
    this._mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          this._setupEventListeners();
        }
      });
    });
    this._mutationObserver.observe(this.shadowRoot, {
      childList: true,
      subtree: true
    });
  }
  _handleToggle(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  _handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._handleItemClick(e);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const items = Array.from(this.shadowRoot.querySelectorAll("collapsible-item"));
      const currentIndex = items.indexOf(e.target);
      let nextIndex;
      if (e.key === "ArrowDown") {
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
    const items = Array.from(this.shadowRoot.querySelectorAll("collapsible-item"));
    const selectedIndex = items.indexOf(selectedItem);
    if (selectedItem === this._currentOpenItem) {
      if (!selectedItem.expanded) {
        selectedItem.expanded = true;
      }
      return;
    }
    items.forEach((item, index) => {
      if (index !== selectedIndex) {
        item.expanded = false;
      } else {
        item.expanded = true;
        this._currentOpenItem = item;
        this._lastOpenedIndex = selectedIndex;
      }
    });
    this.dispatchEvent(new CustomEvent("item-selected", {
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
    console.log("Preloading all images:", this._images.length);
    this._images.forEach((img, index) => {
      if (img && img.src) {
        setTimeout(() => {
          if (!this._preloadedImages.has(img.src) || this._preloadedImages.get(img.src).status === "error") {
            this._loadImage(img, index, false);
          }
        }, index * 50);
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
      return void 0;
    }
    const status = this._preloadedImages.get(this._images[index].src);
    return status ? status.status : void 0;
  }
  // Public method to open a specific item by index
  openItem(index) {
    if (!this.shadowRoot) return;
    const items = Array.from(this.shadowRoot.querySelectorAll("collapsible-item"));
    if (index >= 0 && index < items.length) {
      if (items[index] === this._currentOpenItem) {
        return;
      }
      items.forEach((item) => {
        item.expanded = false;
      });
      items[index].expanded = true;
      this._currentOpenItem = items[index];
      this._lastOpenedIndex = index;
      this.dispatchEvent(new CustomEvent("item-selected", {
        detail: {
          index,
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
    if (priorityIndex !== null && this._images[priorityIndex]) {
      this._loadImage(this._images[priorityIndex], priorityIndex, true);
    }
    this._images.forEach((img, index) => {
      if (priorityIndex !== null && index === priorityIndex) return;
      const imgSrc = img.src;
      if (!this._preloadedImages.has(imgSrc) || this._preloadedImages.get(imgSrc).status === "error") {
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
      console.warn("No image data or src provided");
      return;
    }
    let imgSrc = imageData.src;
    if (!imgSrc.startsWith("http") && !imgSrc.startsWith("data:") && !imgSrc.startsWith("/")) {
      imgSrc = `/${imgSrc}`;
    }
    console.log(`Attempting to load image [${index}]: ${imgSrc}`, { isPriority });
    if (this._preloadedImages.has(imgSrc)) {
      const status = this._preloadedImages.get(imgSrc).status;
      if ((status === "loaded" || status === "loading") && !isPriority) {
        console.log(`Image already ${status}: ${imgSrc}`);
        return;
      }
    }
    this._preloadedImages.set(imgSrc, { status: "loading" });
    const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    this._updateImageInDOM(imgSrc, transparentPixel, false);
    const img = new Image();
    img.onload = () => {
      console.log(`Image loaded successfully: ${imgSrc}`);
      this._preloadedImages.set(imgSrc, {
        status: "loaded",
        element: img,
        width: img.width,
        height: img.height
      });
      this._updateImageInDOM(imgSrc, imgSrc);
    };
    img.onerror = (e) => {
      console.error(`Error loading image: ${imgSrc}`, e);
      this._preloadedImages.set(imgSrc, {
        status: "error",
        error: e
      });
      this._updateImageInDOM(imgSrc, transparentPixel, true);
    };
    img.src = imgSrc;
  }
  /**
   * Updates an image in the DOM when it's loaded
   * @private
   */
  _updateImageInDOM(src, newSrc, isError = false) {
    if (!this.shadowRoot) {
      console.warn("No shadow root available");
      return;
    }
    console.log(`Updating image in DOM: ${src}`, { newSrc, isError });
    let images = [];
    const allImages = Array.from(this.shadowRoot.querySelectorAll("img[data-src]"));
    images = allImages.filter((img) => {
      const dataSrc = img.getAttribute("data-src");
      return dataSrc && (dataSrc === src || dataSrc.endsWith(`/${src}`) || dataSrc.endsWith(src));
    });
    if (images.length === 0) {
      const filename = src.split("/").pop();
      images = allImages.filter((img) => {
        const dataSrc = img.getAttribute("data-src");
        return dataSrc && dataSrc.endsWith(filename);
      });
      console.log(`Trying to find by filename ${filename}, found:`, images.length);
    }
    if (images.length === 0) {
      const filename = src.split("/").pop();
      images = allImages.filter((img) => {
        const dataSrc = img.getAttribute("data-src");
        return dataSrc && dataSrc.includes(filename);
      });
      console.log(`Trying to find by partial filename ${filename}, found:`, images.length);
    }
    if (images.length === 0) {
      const allImagesWithIndex = Array.from(this.shadowRoot.querySelectorAll("img"));
      const index = this._images.findIndex((img) => img && img.src === src);
      if (index >= 0 && index < allImagesWithIndex.length) {
        images = [allImagesWithIndex[index]];
      }
    }
    if (images.length === 0) {
      images = Array.from(this.shadowRoot.querySelectorAll(`img[src="${src}"]`));
    }
    const imageInfo = this._preloadedImages.get(src);
    const isInitialLoad = this._isInitialLoad && (!imageInfo || imageInfo.isInitialLoad !== false);
    images.forEach((img) => {
      if (isError) {
        img.classList.add("image-error");
        img.alt = "Failed to load image";
        img.classList.remove("loading");
      } else if (newSrc) {
        console.log(`Updating image source: ${newSrc}`, { isInitialLoad });
        img.src = newSrc;
        img.removeAttribute("data-src");
        if (isInitialLoad) {
          img.classList.add("loaded");
          if (imageInfo) {
            imageInfo.isInitialLoad = false;
          }
        } else {
          const container = img.closest(".image-container");
          if (container) {
            const startHeight = container.offsetHeight;
            container.style.height = `${startHeight}px`;
            container.style.transition = "height 0.3s ease-in-out";
            void container.offsetHeight;
            container.style.height = "auto";
            const endHeight = container.offsetHeight;
            container.style.height = `${startHeight}px`;
            requestAnimationFrame(() => {
              img.classList.add("loaded");
              container.style.height = `${endHeight}px`;
            });
            container.addEventListener("transitionend", function onEnd() {
              container.style.height = "";
              container.style.transition = "";
              container.removeEventListener("transitionend", onEnd);
            });
          } else {
            img.classList.add("loaded");
          }
        }
      }
      const loader = img.nextElementSibling;
      if (loader && loader.classList.contains("image-loader")) {
        loader.remove();
      }
    });
  }
  _render() {
    if (!this.shadowRoot) return;
    const previousOpenIndex = this._lastOpenedIndex;
    const isInitialRender = !this._hasRendered;
    const noAnimation = this.hasAttribute("no-animation");
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
    const items = this._images.map((image, index) => {
      let imageSrc = image.src;
      if (imageSrc && !imageSrc.startsWith("http") && !imageSrc.startsWith("data:")) {
        imageSrc = imageSrc.startsWith("/") ? imageSrc : `/${imageSrc}`;
      }
      const isLoaded = this._preloadedImages.has(imageSrc) && this._preloadedImages.get(imageSrc).status === "loaded";
      const isLoading = this._preloadedImages.has(imageSrc) && this._preloadedImages.get(imageSrc).status === "loading";
      const imgClasses = ["image-collection__image"];
      if (isLoaded) {
        imgClasses.push("loaded");
      } else if (isLoading) {
        imgClasses.push("loading");
      }
      return `
        <collapsible-item hide-icon data-index="${index}">
          <div class="image-container">
            <img
              ${isLoaded ? `src="${imageSrc}"` : `src="" data-src="${imageSrc}"`}
              alt="${image.alt || image.title || "Image"}"
              class="${imgClasses.join(" ")}"
              loading="lazy"
              onerror="this.onerror=null;this.classList.add('image-error');"
            />
            ${!isLoaded ? '<div class="image-loader">Loading...</div>' : ""}
          </div>
          <div slot="header" class="image-collection__title">${image.title || `Image ${index + 1}`}</div>
          ${image.description ? `<div slot="content">${image.description}</div>` : ""}
        </collapsible-item>
      `;
    }).join("");
    const template = `
      ${style}
      <div class="image-collection">
        <collapsible-list>
          ${items}
        </collapsible-list>
      </div>
    `;
    this.shadowRoot.innerHTML = template;
    if (isInitialRender) {
      const containers = this.shadowRoot.querySelectorAll(".image-container");
      containers.forEach((container) => {
        container.style.height = "300px";
      });
    }
    if (!this._intersectionObserver) {
      this._setupIntersectionObserver();
    }
    this._setupEventListeners();
    if (previousOpenIndex >= 0) {
      this.openItem(previousOpenIndex);
    } else if (this._images.length > 0) {
      this.openItem(0);
    }
    this._preloadImages();
    this._hasRendered = true;
    return Promise.all([
      customElements.get("collapsible-list") || import("./index-BZWRFVTI.js").then((n) => n.c),
      customElements.get("collapsible-item") || import("./index-BZWRFVTI.js").then((n) => n.d)
    ]).then(() => {
      this._setupEventListeners();
      const items2 = Array.from(this.shadowRoot.querySelectorAll("collapsible-item"));
      if (items2.length > 0) {
        if (previousOpenIndex !== -1 && previousOpenIndex < items2.length) {
          items2[previousOpenIndex].expanded = true;
          this._currentOpenItem = items2[previousOpenIndex];
          this._lastOpenedIndex = previousOpenIndex;
        } else if (isInitialRender && this._images.length > 0 && previousOpenIndex === -1) {
          this._lastOpenedIndex = 0;
          if (noAnimation) {
            const items3 = this.shadowRoot.querySelectorAll("collapsible-item");
            if (items3.length > 0) {
              items3[0].expanded = true;
              this._currentOpenItem = items3[0];
            }
          }
        }
      }
      this._hasRendered = true;
    });
  }
}
if (!customElements.get("image-collection")) {
  customElements.define("image-collection", ImageCollection);
}
class ProductLayout extends HTMLElement {
  static get observedAttributes() {
    return ["title", "images"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._title = "";
    this._images = [];
    this._isConnected = false;
    this._hasRendered = false;
    this._isUpdating = false;
    this._elements = null;
    this._render = this._render.bind(this);
  }
  get title() {
    return this._title;
  }
  set title(value) {
    const newValue = value || "";
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
    if (typeof value === "string") {
      try {
        newImages = value ? JSON.parse(value) : [];
      } catch (e) {
        console.error("Invalid images data format", e);
        newImages = [];
      }
    } else if (Array.isArray(value)) {
      newImages = [...value];
    }
    const imagesChanged = JSON.stringify(this._images) !== JSON.stringify(newImages);
    this._images = newImages;
    if (imagesChanged && this._isConnected) {
      this._updateImages();
    }
  }
  connectedCallback() {
    if (this._isConnected) return;
    this._isConnected = true;
    if (this.hasAttribute("title")) {
      this._title = this.getAttribute("title");
    }
    if (this.hasAttribute("images")) {
      try {
        this._images = JSON.parse(this.getAttribute("images") || "[]");
      } catch (e) {
        console.error("Invalid initial images data", e);
        this._images = [];
      }
    }
    this._render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
      case "title":
        this.title = newValue;
        break;
      case "images":
        this.images = newValue;
        break;
    }
  }
  _renderImageCollection() {
    if (!this._images || this._images.length === 0) return "";
    const images = Array.isArray(this._images) ? this._images : [];
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
      title: this.shadowRoot.querySelector(".header h2"),
      imageContainer: this.shadowRoot.querySelector(".image-collection-container"),
      header: this.shadowRoot.querySelector(".header"),
      content: this.shadowRoot.querySelector(".content")
    };
  }
  _updateTitle() {
    var _a;
    if (!this.shadowRoot) return;
    if ((_a = this._elements) == null ? void 0 : _a.title) {
      this._elements.title.textContent = this._title;
    } else if (this._isConnected) {
      this._render();
    }
  }
  _updateImages() {
    var _a;
    if (this._isUpdating || !this.shadowRoot || !this._isConnected) return;
    this._isUpdating = true;
    try {
      const imageCollection = this.shadowRoot.querySelector("image-collection");
      if (imageCollection) {
        const currentImages = imageCollection.getAttribute("images");
        const newImages = JSON.stringify(this._images);
        if (currentImages !== newImages) {
          imageCollection.setAttribute("images", newImages);
        }
      } else if ((_a = this._elements) == null ? void 0 : _a.imageContainer) {
        this._elements.imageContainer.innerHTML = this._renderImageCollection();
      } else if (!this._hasRendered) {
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
        ` : ""}
        
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
        this._updateTitle();
        this._updateImages();
      }
    } finally {
      this._isUpdating = false;
    }
  }
}
if (typeof window !== "undefined" && !customElements.get("product-layout")) {
  customElements.define("product-layout", ProductLayout);
}
export {
  ProductLayout
};
//# sourceMappingURL=ProductLayout-DG3gJKwD.js.map
