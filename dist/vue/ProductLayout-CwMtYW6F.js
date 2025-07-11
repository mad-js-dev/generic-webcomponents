import "./index-C0yFguPQ.js";
class d extends HTMLElement {
  static get observedAttributes() {
    return ["images"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._images = [], this._handleToggle = this._handleToggle.bind(this), this._currentOpenIndex = 0;
  }
  get images() {
    return this._images;
  }
  set images(e) {
    if (Array.isArray(e))
      this._images = e, this.render();
    else if (typeof e == "string")
      try {
        this._images = JSON.parse(e), this.render();
      } catch {
      }
  }
  connectedCallback() {
    this.render(), this.shadowRoot.addEventListener("toggle", this._handleToggle);
  }
  disconnectedCallback() {
    this.shadowRoot.removeEventListener("toggle", this._handleToggle);
  }
  _handleToggle(e) {
    if (e.stopPropagation(), this._isHandlingToggle) return;
    this._isHandlingToggle = !0;
    let t = -1, s = !1;
    try {
      const i = e.composedPath().find(
        (n) => n.nodeType === Node.ELEMENT_NODE && n.getAttribute && n.getAttribute("is") === "collapsible-item"
      );
      if (!i)
        return;
      const o = Array.from(this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'));
      if (t = o.indexOf(i), t === -1 || t === this._currentOpenIndex)
        return;
      s = i.expanded, o.forEach((n, r) => {
        r !== t && n.expanded && (n.expanded = !1);
      }), t === this._currentOpenIndex ? (i.expanded = !1, this._currentOpenIndex = -1) : (i.expanded = !0, this._currentOpenIndex = t);
    } finally {
      this._isHandlingToggle = !1;
    }
    this.dispatchEvent(new CustomEvent("toggle", {
      detail: {
        index: t,
        expanded: !s,
        source: "image-collection"
      },
      bubbles: !0,
      composed: !0
    }));
  }
  _onItemToggle(e) {
    e.stopPropagation();
    const t = e.target.closest('li[is="collapsible-item"]');
    if (!t) return;
    const s = Array.from(this.shadowRoot.querySelectorAll('li[is="collapsible-item"]')), i = s.indexOf(t);
    if (i !== -1) {
      if (!e.detail.expanded) {
        this._currentOpenIndex === i && (this._currentOpenIndex = -1);
        return;
      }
      if (this._currentOpenIndex !== -1 && this._currentOpenIndex !== i) {
        const o = s[this._currentOpenIndex];
        o && o.toggle(!1);
      }
      this._currentOpenIndex = i;
    }
  }
  render() {
    this.shadowRoot && (this._currentOpenIndex === -1 && this._images.length > 0 && (this._currentOpenIndex = 0), this.shadowRoot.innerHTML = `
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
                    ${this._images.map((e, t) => `
                        <li is="collapsible-item" 
                            label="${e.title}" 
                            ${e.removeshift ? 'removeshift="true"' : ""}
                            ${this._currentOpenIndex === t ? "expanded" : ""}
                            hide-icon
                            >
                            <div slot="content">
                                <img 
                                    class="image-collection__image" 
                                    src="${e.src}" 
                                    alt="${e.title}"
                                    loading="lazy"
                                >
                            </div>
                        </li>
                    `).join("")}
                </ul>
            </div>
        `);
  }
}
customElements.get("image-collection") || customElements.define("image-collection", d);
const l = [
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
class c extends HTMLElement {
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
  attributeChangedCallback(e, t, s) {
    if (t !== s) {
      if (e === "title")
        this._title = s || "Product Name", this._updateTitle();
      else if (e === "images")
        if (typeof s == "string")
          try {
            const i = JSON.parse(s);
            this.images = Array.isArray(i) ? i : [];
          } catch (i) {
            console.error("Invalid images JSON:", i), this.images = [];
          }
        else Array.isArray(s) ? this.images = s : this.images = [];
    }
  }
  get title() {
    return this._title;
  }
  set title(e) {
    this._title !== e && (this._title = e || "", this._updateTitle());
  }
  get images() {
    return this._images;
  }
  set images(e) {
    if (Array.isArray(e))
      this._images = e.length > 0 ? e : [...l];
    else if (typeof e == "string")
      try {
        const t = JSON.parse(e);
        this._images = Array.isArray(t) ? t : [...l];
      } catch (t) {
        console.error("Invalid images JSON:", t), this._images = [...l];
      }
    else
      this._images = [...l];
    this._updateImages();
  }
  _updateTitle() {
    var e;
    (e = this._elements) != null && e.title && (this._elements.title.textContent = this._title);
  }
  _updateImages() {
    var e;
    (e = this._elements) != null && e.imageCollection && (this._elements.imageCollection.images = [...this._images], this._elements.imageCollectionContainer && (this._elements.imageCollectionContainer.style.display = "block"));
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
        }, this._images.length === 0 && (this._images = [...l]), this._hasRendered = !0), this._updateTitle(), this._updateImages();
      } finally {
        this._isUpdating = !1;
      }
    }
  }
}
typeof window < "u" && !customElements.get("product-layout") && customElements.define("product-layout", c);
export {
  c as ProductLayout
};
//# sourceMappingURL=ProductLayout-CwMtYW6F.js.map
