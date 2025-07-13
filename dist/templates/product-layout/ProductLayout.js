import "../../organisms/image-collection/ImageCollection.js";
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
//# sourceMappingURL=ProductLayout.js.map
