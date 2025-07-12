import "../../organisms/image-collection/ImageCollection.js";
const s = [
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
class n extends HTMLElement {
  static get observedAttributes() {
    return ["title", "images"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._title = "Product Name", this._images = [], this._isConnected = !1, this._hasRendered = !1, this._isUpdating = !1, this._elements = null, this._render = this._render.bind(this);
  }
  connectedCallback() {
    this._isConnected = !0, this._render();
  }
  disconnectedCallback() {
    this._isConnected = !1;
  }
  attributeChangedCallback(t, e, i) {
    if (e !== i) {
      if (t === "title")
        this._title = i || "Product Name", this._updateTitle();
      else if (t === "images")
        if (typeof i == "string")
          try {
            const a = JSON.parse(i);
            this.images = Array.isArray(a) ? a : [];
          } catch (a) {
            console.error("Invalid images JSON:", a), this.images = [];
          }
        else Array.isArray(i) ? this.images = i : this.images = [];
    }
  }
  get title() {
    return this._title;
  }
  set title(t) {
    this._title !== t && (this._title = t || "", this._updateTitle());
  }
  get images() {
    return this._images;
  }
  set images(t) {
    if (Array.isArray(t))
      this._images = t.length > 0 ? t : [...s];
    else if (typeof t == "string")
      try {
        const e = JSON.parse(t);
        this._images = Array.isArray(e) ? e : [...s];
      } catch (e) {
        console.error("Invalid images JSON:", e), this._images = [...s];
      }
    else
      this._images = [...s];
    this._updateImages();
  }
  _updateTitle() {
    var t;
    (t = this._elements) != null && t.title && (this._elements.title.textContent = this._title);
  }
  _updateImages() {
    var t;
    (t = this._elements) != null && t.imageCollection && (this._elements.imageCollection.images = [...this._images], this._elements.imageCollectionContainer && (this._elements.imageCollectionContainer.style.display = "block"));
  }
  _render() {
    if (!(this._isUpdating || !this.shadowRoot)) {
      this._isUpdating = !0;
      try {
        this._hasRendered || (this.shadowRoot.innerHTML = `
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
        `, this._elements = {
          title: this.shadowRoot.getElementById("title"),
          content: this.shadowRoot.getElementById("content"),
          imageCollection: this.shadowRoot.getElementById("imageCollection"),
          imageCollectionContainer: this.shadowRoot.getElementById("imageCollectionContainer")
        }, this._images.length === 0 && (this._images = [...s]), this._hasRendered = !0), this._updateTitle(), this._updateImages();
      } finally {
        this._isUpdating = !1;
      }
    }
  }
}
typeof window < "u" && !customElements.get("product-layout") && customElements.define("product-layout", n);
export {
  n as ProductLayout
};
//# sourceMappingURL=ProductLayout.js.map
