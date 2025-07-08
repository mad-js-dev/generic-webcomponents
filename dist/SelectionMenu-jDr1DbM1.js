class SelectionMenu extends HTMLElement {
  static get observedAttributes() {
    return ["items", "selected"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._items = [];
    this._selectedId = null;
    this._boundOnItemClick = this._onItemClick.bind(this);
    import("./index-2arlkGxx.js").then((n) => n.c);
  }
  connectedCallback() {
    this._render();
  }
  disconnectedCallback() {
    this._removeEventListeners();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
      case "items":
        this._items = newValue ? JSON.parse(newValue) : [];
        this._render();
        break;
      case "selected":
        this._selectedId = newValue;
        this._updateSelectedState();
        break;
    }
  }
  get items() {
    return JSON.stringify(this._items);
  }
  set items(value) {
    this._items = value ? JSON.parse(value) : [];
    this._render();
  }
  get selected() {
    return this._selectedId;
  }
  set selected(value) {
    if (this._selectedId !== value) {
      this._selectedId = value;
      this._updateSelectedState();
    }
  }
  _render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
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
    `;
    this._addEventListeners();
  }
  _renderItems(items, level = 0) {
    if (!items || !items.length) return "";
    const listContainer = document.createElement("ul");
    listContainer.style.listStyle = "none";
    listContainer.style.padding = "0";
    listContainer.style.margin = "0";
    items.forEach((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isSelected = this._selectedId === item.id;
      const li = document.createElement("li");
      li.setAttribute("data-id", item.id);
      if (hasChildren) {
        li.setAttribute("is", "collapsible-item");
        li.setAttribute("data-id", item.id);
        li.setAttribute("label", item.name);
        const hasSelectedDescendant = this._hasSelectedDescendant(item);
        const isExpanded = hasSelectedDescendant || isSelected;
        if (isExpanded) {
          li.setAttribute("expanded", "");
        }
        li.setAttribute("icon", isExpanded ? "▼" : "▶");
        li.style.marginRight = "8px";
        li.style.transition = "transform 0.2s ease";
        if (isSelected) {
          li.classList.add("menu-item--selected");
        }
        const childList = document.createElement("ul");
        childList.className = "menu-item__child-list";
        childList.innerHTML = this._renderItems(item.children, level + 1);
        const contentSlot = document.createElement("div");
        contentSlot.slot = "content";
        contentSlot.className = "menu-item__content";
        contentSlot.appendChild(childList);
        li.appendChild(contentSlot);
        li.addEventListener("toggle", (e) => {
          contentSlot.style.display = e.detail.expanded ? "block" : "none";
        });
      } else {
        const span = document.createElement("span");
        span.className = "menu-item__leaf";
        if (isSelected) span.classList.add("menu-item--selected");
        const label = document.createElement("span");
        label.className = "menu-item__label";
        label.textContent = item.name;
        span.appendChild(label);
        span.addEventListener("click", (e) => {
          e.stopPropagation();
          this._selectedId = item.id;
          this._updateSelectedState();
          this.dispatchEvent(new CustomEvent("item-selected", {
            detail: {
              id: item.id,
              item,
              name: item.name
            },
            bubbles: true,
            composed: true
          }));
        });
        li.appendChild(span);
      }
      listContainer.appendChild(li);
    });
    return level === 0 ? listContainer.outerHTML : listContainer.innerHTML;
  }
  _addEventListeners() {
    this.shadowRoot.addEventListener("click", this._boundOnItemClick);
  }
  _removeEventListeners() {
    this.shadowRoot.removeEventListener("click", this._boundOnItemClick);
  }
  _onItemClick(event) {
    const leafNode = event.target.closest(".menu-item__leaf");
    if (leafNode) {
      event.stopPropagation();
      const itemId = leafNode.getAttribute("data-id");
      if (itemId) {
        this.selected = itemId;
        this._updateSelectedState();
        this.dispatchEvent(new CustomEvent("item-selected", {
          detail: { id: itemId },
          bubbles: true,
          composed: true
        }));
      }
      return;
    }
    const header = event.target.closest(".collapsible-item__header");
    if (!header) return;
    const itemElement = header.parentElement;
    if (itemElement && itemElement.getAttribute("is") === "collapsible-item") {
      event.stopPropagation();
      const isExpanded = itemElement.hasAttribute("expanded");
      const arrowIcon = itemElement.querySelector(".menu-item__arrow");
      if (isExpanded) {
        itemElement.removeAttribute("expanded");
        if (arrowIcon) arrowIcon.textContent = "▶";
      } else {
        itemElement.setAttribute("expanded", "");
        if (arrowIcon) arrowIcon.textContent = "▼";
      }
      itemElement.dispatchEvent(new CustomEvent("toggle", {
        detail: { expanded: !isExpanded },
        bubbles: true,
        composed: true
      }));
    }
  }
  _updateSelectedState() {
    if (!this.shadowRoot) return;
    const allCollapsibleItems = this.shadowRoot.querySelectorAll('li[is="collapsible-item"]');
    const allLeafItems = this.shadowRoot.querySelectorAll(".menu-item__leaf");
    allCollapsibleItems.forEach((item) => {
      item.classList.remove("menu-item--selected");
      item.removeAttribute("selected");
    });
    allLeafItems.forEach((leaf) => {
      leaf.classList.remove("menu-item--selected");
    });
    if (this._selectedId) {
      const selectedCollapsibleItem = this.shadowRoot.querySelector(`li[is="collapsible-item"][data-id="${this._selectedId}"]`);
      if (selectedCollapsibleItem) {
        selectedCollapsibleItem.classList.add("menu-item--selected");
        selectedCollapsibleItem.setAttribute("selected", "");
      }
      const selectedLeafItem = this.shadowRoot.querySelector(`li[data-id="${this._selectedId}"] .menu-item__leaf`);
      if (selectedLeafItem) {
        selectedLeafItem.classList.add("menu-item--selected");
      }
      if (!selectedCollapsibleItem && !selectedLeafItem) {
        console.warn("Could not find selected item in the DOM. It might be in a closed collapsible section.");
      }
    }
  }
  _hasSelectedDescendant(item) {
    if (!item) return false;
    if (item.id === this._selectedId) return true;
    if (item.children) {
      return item.children.some((child) => this._hasSelectedDescendant(child));
    }
    return false;
  }
  _findItemById(items, id) {
    if (!items || !items.length) return null;
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = this._findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }
}
if (!customElements.get("selection-menu")) {
  customElements.define("selection-menu", SelectionMenu);
}
export {
  SelectionMenu
};
//# sourceMappingURL=SelectionMenu-jDr1DbM1.js.map
