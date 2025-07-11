class u extends HTMLElement {
  static get observedAttributes() {
    return ["items", "selected"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._items = [], this._selectedId = null, this._boundOnItemClick = this._onItemClick.bind(this), import("./index-C0yFguPQ.js").then((e) => e.C);
  }
  connectedCallback() {
    this._render();
  }
  disconnectedCallback() {
    this._removeEventListeners();
  }
  attributeChangedCallback(e, i, t) {
    if (i !== t)
      switch (e) {
        case "items":
          this._items = t ? JSON.parse(t) : [], this._render();
          break;
        case "selected":
          this._selectedId = t, this._updateSelectedState();
          break;
      }
  }
  get items() {
    return JSON.stringify(this._items);
  }
  set items(e) {
    this._items = e ? JSON.parse(e) : [], this._render();
  }
  get selected() {
    return this._selectedId;
  }
  set selected(e) {
    this._selectedId !== e && (this._selectedId = e, this._updateSelectedState());
  }
  _render() {
    this.shadowRoot && (this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --primary-color: #4a6cf7;
          --hover-bg: #f5f8ff;
          --selected-bg: #e6f0ff;
          --border-color: #e2e8f0;
          --text-color: #2d3748;
          --text-secondary: #4a5568;
        }
        
        .menu-container {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          overflow: hidden;
        }
        
        .menu-item {
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin: 2px 0;
          border-radius: 4px;
        }
        
        .menu-item:hover {
          background-color: var(--hover-bg, #f5f8ff);
        }
        
        .menu-item--selected {
          background-color: var(--selected-bg, #e6f0ff);
          color: var(--primary-color, #4a6cf7);
          font-weight: 500;
        }
        
        .menu-item--selected:hover {
          background-color: var(--selected-bg, #e6f0ff);
        }
        
        /* Style for the collapsible item header */
        .menu-item::part(header) {
          padding: 8px 12px;
          display: flex;
          align-items: center;
        }
        
        /* Style for the collapsible item content */
        .menu-item::part(content) {
          padding: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.2s ease;
          max-height: 0;
          opacity: 0;
          margin: 0;
        }
        
        .menu-item::part(content).menu-item__content--expanded {
          max-height: 1000px; /* Adjust based on your needs */
          opacity: 1;
          padding: 4px 0 4px 1rem;
        }
        
        .menu-item__child-list {
          list-style: none;
          padding: 0;
          margin: 0 0 0 1rem;
        }
        
        /* Remove bullets from ul elements */
        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        
        /* Ensure list items have no default styling */
        li {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        /* Leaf item styles */
        .menu-item__leaf {
          display: flex;
          align-items: center;
          padding: 4px 12px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-radius: 4px;
        }
        
        .menu-item__leaf:hover {
          background-color: var(--hover-bg, #f5f8ff);
        }
        
        .menu-item__leaf.menu-item--selected {
          background-color: var(--selected-bg, #e6f0ff);
          color: var(--primary-color, #4a6cf7);
          font-weight: 500;
        }
        
        /* Arrow icon for collapsible items */
        .menu-item__arrow {
          display: inline-block;
          width: 12px;
          text-align: center;
          transition: transform 0.2s ease;
        }
        
        .menu-item[expanded] .menu-item__arrow {
          transform: rotate(90deg);
        }
      </style>
      <div class="menu-container">
        ${this._renderItems(this._items, 0)}
      </div>
    `, this._addEventListeners());
  }
  _renderItems(e, i = 0) {
    if (!e || !e.length) return "";
    const t = document.createElement("ul");
    return t.style.listStyle = "none", t.style.padding = "0", t.style.margin = "0", e.forEach((s) => {
      const l = s.children && s.children.length > 0, d = this._selectedId === s.id, n = document.createElement("li");
      if (n.setAttribute("data-id", s.id), l) {
        n.setAttribute("is", "collapsible-item"), n.setAttribute("data-id", s.id), n.setAttribute("label", s.name);
        const r = this._hasSelectedDescendant(s) || d;
        r && n.setAttribute("expanded", ""), n.setAttribute("icon", r ? "▼" : "▶"), n.style.marginRight = "8px", n.style.transition = "transform 0.2s ease", d && n.classList.add("menu-item--selected");
        const a = document.createElement("ul");
        a.className = "menu-item__child-list", a.innerHTML = this._renderItems(s.children, i + 1);
        const c = document.createElement("div");
        c.slot = "content", c.className = "menu-item__content", c.appendChild(a), n.appendChild(c), n.addEventListener("toggle", (m) => {
          c.style.display = m.detail.expanded ? "block" : "none";
        });
      } else {
        const o = document.createElement("span");
        o.className = "menu-item__leaf", d && o.classList.add("menu-item--selected");
        const r = document.createElement("span");
        r.className = "menu-item__label", r.textContent = s.name, o.appendChild(r), o.addEventListener("click", (a) => {
          a.stopPropagation(), this._selectedId = s.id, this._updateSelectedState(), this.dispatchEvent(new CustomEvent("item-selected", {
            detail: {
              id: s.id,
              item: s,
              name: s.name
            },
            bubbles: !0,
            composed: !0
          }));
        }), n.appendChild(o);
      }
      t.appendChild(n);
    }), i === 0 ? t.outerHTML : t.innerHTML;
  }
  _addEventListeners() {
    this.shadowRoot.addEventListener("click", this._boundOnItemClick);
  }
  _removeEventListeners() {
    this.shadowRoot.removeEventListener("click", this._boundOnItemClick);
  }
  _onItemClick(e) {
    const i = e.target.closest(".menu-item__leaf");
    if (i) {
      e.stopPropagation();
      const l = i.getAttribute("data-id");
      l && (this.selected = l, this._updateSelectedState(), this.dispatchEvent(new CustomEvent("item-selected", {
        detail: { id: l },
        bubbles: !0,
        composed: !0
      })));
      return;
    }
    const t = e.target.closest(".collapsible-item__header");
    if (!t) return;
    const s = t.parentElement;
    if (s && s.getAttribute("is") === "collapsible-item") {
      e.stopPropagation();
      const l = s.hasAttribute("expanded"), d = s.querySelector(".menu-item__arrow");
      l ? (s.removeAttribute("expanded"), d && (d.textContent = "▶")) : (s.setAttribute("expanded", ""), d && (d.textContent = "▼")), s.dispatchEvent(new CustomEvent("toggle", {
        detail: { expanded: !l },
        bubbles: !0,
        composed: !0
      }));
    }
  }
  _updateSelectedState() {
    if (!this.shadowRoot) return;
    const e = this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'), i = this.shadowRoot.querySelectorAll(".menu-item__leaf");
    if (e.forEach((t) => {
      t.classList.remove("menu-item--selected"), t.removeAttribute("selected");
    }), i.forEach((t) => {
      t.classList.remove("menu-item--selected");
    }), this._selectedId) {
      const t = this.shadowRoot.querySelector(`li[is="collapsible-item"][data-id="${this._selectedId}"]`);
      t && (t.classList.add("menu-item--selected"), t.setAttribute("selected", ""));
      const s = this.shadowRoot.querySelector(`li[data-id="${this._selectedId}"] .menu-item__leaf`);
      s && s.classList.add("menu-item--selected"), !t && !s && console.warn("Could not find selected item in the DOM. It might be in a closed collapsible section.");
    }
  }
  _hasSelectedDescendant(e) {
    return e ? e.id === this._selectedId ? !0 : e.children ? e.children.some((i) => this._hasSelectedDescendant(i)) : !1 : !1;
  }
  _findItemById(e, i) {
    if (!e || !e.length) return null;
    for (const t of e) {
      if (t.id === i) return t;
      if (t.children) {
        const s = this._findItemById(t.children, i);
        if (s) return s;
      }
    }
    return null;
  }
}
customElements.get("selection-menu") || customElements.define("selection-menu", u);
export {
  u as SelectionMenu
};
//# sourceMappingURL=SelectionMenu-Dkc4cLuv.js.map
