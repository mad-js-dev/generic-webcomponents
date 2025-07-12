class u extends HTMLElement {
  static get observedAttributes() {
    return ["items", "selected"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._items = [], this._selectedId = null, this._boundOnItemClick = this._onItemClick.bind(this), import("../../molecules/collapsible-item/CollapsibleItem.js");
  }
  connectedCallback() {
    this._render();
  }
  disconnectedCallback() {
    this._removeEventListeners();
  }
  attributeChangedCallback(s, i, e) {
    if (i !== e)
      switch (s) {
        case "items":
          this._items = e ? JSON.parse(e) : [], this._render();
          break;
        case "selected":
          this._selectedId = e, this._updateSelectedState();
          break;
      }
  }
  get items() {
    return JSON.stringify(this._items);
  }
  set items(s) {
    this._items = s ? JSON.parse(s) : [], this._render();
  }
  get selected() {
    return this._selectedId;
  }
  set selected(s) {
    this._selectedId !== s && (this._selectedId = s, this._updateSelectedState());
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
  _renderItems(s, i = 0) {
    if (!s || !s.length) return "";
    const e = document.createElement("ul");
    return e.style.listStyle = "none", e.style.padding = "0", e.style.margin = "0", s.forEach((t) => {
      const l = t.children && t.children.length > 0, d = this._selectedId === t.id, n = document.createElement("li");
      if (n.setAttribute("data-id", t.id), l) {
        n.setAttribute("is", "collapsible-item"), n.setAttribute("data-id", t.id), n.setAttribute("label", t.name);
        const r = this._hasSelectedDescendant(t) || d;
        r && n.setAttribute("expanded", ""), n.setAttribute("icon", r ? "▼" : "▶"), n.style.marginRight = "8px", n.style.transition = "transform 0.2s ease", d && n.classList.add("menu-item--selected");
        const a = document.createElement("ul");
        a.className = "menu-item__child-list", a.innerHTML = this._renderItems(t.children, i + 1);
        const c = document.createElement("div");
        c.slot = "content", c.className = "menu-item__content", c.appendChild(a), n.appendChild(c), n.addEventListener("toggle", (m) => {
          c.style.display = m.detail.expanded ? "block" : "none";
        });
      } else {
        const o = document.createElement("span");
        o.className = "menu-item__leaf", d && o.classList.add("menu-item--selected");
        const r = document.createElement("span");
        r.className = "menu-item__label", r.textContent = t.name, o.appendChild(r), o.addEventListener("click", (a) => {
          a.stopPropagation(), this._selectedId = t.id, this._updateSelectedState(), this.dispatchEvent(new CustomEvent("item-selected", {
            detail: {
              id: t.id,
              item: t,
              name: t.name
            },
            bubbles: !0,
            composed: !0
          }));
        }), n.appendChild(o);
      }
      e.appendChild(n);
    }), i === 0 ? e.outerHTML : e.innerHTML;
  }
  _addEventListeners() {
    this.shadowRoot.addEventListener("click", this._boundOnItemClick);
  }
  _removeEventListeners() {
    this.shadowRoot.removeEventListener("click", this._boundOnItemClick);
  }
  _onItemClick(s) {
    const i = s.target.closest(".menu-item__leaf");
    if (i) {
      s.stopPropagation();
      const l = i.getAttribute("data-id");
      l && (this.selected = l, this._updateSelectedState(), this.dispatchEvent(new CustomEvent("item-selected", {
        detail: { id: l },
        bubbles: !0,
        composed: !0
      })));
      return;
    }
    const e = s.target.closest(".collapsible-item__header");
    if (!e) return;
    const t = e.parentElement;
    if (t && t.getAttribute("is") === "collapsible-item") {
      s.stopPropagation();
      const l = t.hasAttribute("expanded"), d = t.querySelector(".menu-item__arrow");
      l ? (t.removeAttribute("expanded"), d && (d.textContent = "▶")) : (t.setAttribute("expanded", ""), d && (d.textContent = "▼")), t.dispatchEvent(new CustomEvent("toggle", {
        detail: { expanded: !l },
        bubbles: !0,
        composed: !0
      }));
    }
  }
  _updateSelectedState() {
    if (!this.shadowRoot) return;
    const s = this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'), i = this.shadowRoot.querySelectorAll(".menu-item__leaf");
    if (s.forEach((e) => {
      e.classList.remove("menu-item--selected"), e.removeAttribute("selected");
    }), i.forEach((e) => {
      e.classList.remove("menu-item--selected");
    }), this._selectedId) {
      const e = this.shadowRoot.querySelector(`li[is="collapsible-item"][data-id="${this._selectedId}"]`);
      e && (e.classList.add("menu-item--selected"), e.setAttribute("selected", ""));
      const t = this.shadowRoot.querySelector(`li[data-id="${this._selectedId}"] .menu-item__leaf`);
      t && t.classList.add("menu-item--selected"), !e && !t && console.warn("Could not find selected item in the DOM. It might be in a closed collapsible section.");
    }
  }
  _hasSelectedDescendant(s) {
    return s ? s.id === this._selectedId ? !0 : s.children ? s.children.some((i) => this._hasSelectedDescendant(i)) : !1 : !1;
  }
  _findItemById(s, i) {
    if (!s || !s.length) return null;
    for (const e of s) {
      if (e.id === i) return e;
      if (e.children) {
        const t = this._findItemById(e.children, i);
        if (t) return t;
      }
    }
    return null;
  }
}
customElements.get("selection-menu") || customElements.define("selection-menu", u);
export {
  u as SelectionMenu
};
//# sourceMappingURL=SelectionMenu.js.map
