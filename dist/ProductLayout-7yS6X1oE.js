import "./index-2arlkGxx.js";
class ImageCollection extends HTMLElement {
  static get observedAttributes() {
    return ["images"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
    } else if (typeof value === "string") {
      try {
        this._images = JSON.parse(value);
        this.render();
      } catch (e) {
      }
    }
  }
  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener("toggle", this._handleToggle);
  }
  disconnectedCallback() {
    this.shadowRoot.removeEventListener("toggle", this._handleToggle);
  }
  _handleToggle(event) {
    event.stopPropagation();
    if (this._isHandlingToggle) return;
    this._isHandlingToggle = true;
    let index = -1;
    let wasExpanded = false;
    try {
      const target = event.composedPath().find(
        (node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute && node.getAttribute("is") === "collapsible-item"
      );
      if (!target) {
        return;
      }
      const allItems = Array.from(this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'));
      index = allItems.indexOf(target);
      if (index === -1) {
        return;
      }
      if (index === this._currentOpenIndex) {
        return;
      }
      wasExpanded = target.expanded;
      allItems.forEach((item, i) => {
        if (i !== index && item.expanded) {
          item.expanded = false;
        }
      });
      if (index === this._currentOpenIndex) {
        target.expanded = false;
        this._currentOpenIndex = -1;
      } else {
        target.expanded = true;
        this._currentOpenIndex = index;
      }
    } finally {
      this._isHandlingToggle = false;
    }
    this.dispatchEvent(new CustomEvent("toggle", {
      detail: {
        index,
        expanded: !wasExpanded,
        source: "image-collection"
      },
      bubbles: true,
      composed: true
    }));
  }
  _onItemToggle(event) {
    event.stopPropagation();
    const targetItem = event.target.closest('li[is="collapsible-item"]');
    if (!targetItem) return;
    const items = Array.from(this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'));
    const index = items.indexOf(targetItem);
    if (index === -1) return;
    if (!event.detail.expanded) {
      if (this._currentOpenIndex === index) {
        this._currentOpenIndex = -1;
      }
      return;
    }
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
                            ${image.removeshift ? 'removeshift="true"' : ""}
                            ${this._currentOpenIndex === index ? "expanded" : ""}
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
                    `).join("")}
                </ul>
            </div>
        `;
  }
}
if (!customElements.get("image-collection")) {
  customElements.define("image-collection", ImageCollection);
}
const defaultImages = [
  {
    title: "Nature",
    src: "images/samples/nature.jpg",
    alt: "Scenic nature landscape",
    description: "A beautiful landscape showcasing nature's beauty."
  },
  {
    title: "Architecture",
    src: "images/samples/architecture.jpg",
    alt: "Modern architecture building",
    description: "Stunning modern architecture design."
  },
  {
    title: "Technology",
    src: "images/samples/technology.jpg",
    alt: "Technology circuit board",
    description: "Close-up of an advanced circuit board."
  }
];
class ProductLayout extends HTMLElement {
  static get observedAttributes() {
    return ["title", "images"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._title = "Product Name";
    this._images = [];
    this._isConnected = false;
    this._hasRendered = false;
    this._isUpdating = false;
    this._elements = null;
    this._render = this._render.bind(this);
  }
  connectedCallback() {
    this._isConnected = true;
    this._render();
  }
  disconnectedCallback() {
    this._isConnected = false;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "title") {
      this._title = newValue || "Product Name";
      this._updateTitle();
    } else if (name === "images") {
      if (typeof newValue === "string") {
        try {
          const parsed = JSON.parse(newValue);
          this.images = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error("Invalid images JSON:", e);
          this.images = [];
        }
      } else if (Array.isArray(newValue)) {
        this.images = newValue;
      } else {
        this.images = [];
      }
    }
  }
  get title() {
    return this._title;
  }
  set title(value) {
    if (this._title === value) return;
    this._title = value || "";
    this._updateTitle();
  }
  get images() {
    return this._images;
  }
  set images(value) {
    if (Array.isArray(value)) {
      this._images = value.length > 0 ? value : [...defaultImages];
    } else if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        this._images = Array.isArray(parsed) ? parsed : [...defaultImages];
      } catch (e) {
        console.error("Invalid images JSON:", e);
        this._images = [...defaultImages];
      }
    } else {
      this._images = [...defaultImages];
    }
    this._updateImages();
  }
  _updateTitle() {
    var _a;
    if (!((_a = this._elements) == null ? void 0 : _a.title)) return;
    this._elements.title.textContent = this._title;
  }
  _updateImages() {
    var _a;
    if (!((_a = this._elements) == null ? void 0 : _a.imageCollection)) return;
    this._elements.imageCollection.images = [...this._images];
    if (this._elements.imageCollectionContainer) {
      this._elements.imageCollectionContainer.style.display = "block";
    }
  }
  _render() {
    if (this._isUpdating || !this.shadowRoot) return;
    this._isUpdating = true;
    try {
      if (!this._hasRendered) {
        this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: block;
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
            
            .product-layout {
              display: grid;
              grid-template-columns: 1fr;
              gap: 2rem;
            }
            
            .product-header {
              text-align: center;
              margin-bottom: 2rem;
            }
            
            .product-title {
              font-size: 2.5rem;
              color: #2d3748;
              margin: 0 0 1rem;
            }
            
            .content {
              line-height: 1.6;
              color: #4a5568;
            }
            
            .image-collection-container {
              margin: 2rem 0;
            }
            
            /* Remove padding from collapsible items */
            image-collection::part(content) {
              padding: 0;
            }
            
            @media (min-width: 1024px) {
              .product-layout {
                grid-template-columns: 1fr 1fr;
                align-items: start;
              }
            }
          </style>
          <div class="product-layout">
            <div class="product-content">
              <div class="product-header">
                <h1 class="product-title" id="title"></h1>
              </div>
              <div class="content" id="content">
                <slot></slot>
              </div>
            </div>
            <div class="image-collection-container" id="imageCollectionContainer" style="display: none;">
              <image-collection id="imageCollection"></image-collection>
            </div>
          </div>
        `;
        this._elements = {
          title: this.shadowRoot.getElementById("title"),
          content: this.shadowRoot.getElementById("content"),
          imageCollection: this.shadowRoot.getElementById("imageCollection"),
          imageCollectionContainer: this.shadowRoot.getElementById("imageCollectionContainer")
        };
        if (this._images.length === 0) {
          this._images = [...defaultImages];
        }
        this._hasRendered = true;
      }
      this._updateTitle();
      this._updateImages();
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
//# sourceMappingURL=ProductLayout-7yS6X1oE.js.map
