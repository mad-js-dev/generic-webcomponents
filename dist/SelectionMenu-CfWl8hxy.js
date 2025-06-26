class SelectionMenu extends HTMLElement {
  static get observedAttributes() {
    return ["value", "data", "block-events-on-parent", "reverse-heading"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._selectedId = null;
    this._data = [];
    this._blockEventsOnParent = false;
    this._reverseHeading = true;
  }
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
      case "data":
        this.data = newValue ? JSON.parse(newValue) : [];
        break;
      case "value":
        this.setSelectedItem(newValue);
        break;
      case "block-events-on-parent":
        this.blockEventsOnParent = newValue !== null;
        break;
      case "reverse-heading":
        this.reverseHeading = newValue !== "false";
        break;
    }
  }
  render() {
    this.shadowRoot.innerHTML = "";
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        --primary-color: #4a6cf7;
        --primary-light: #e6f0ff;
        --hover-color: #f5f8ff;
        --selected-color: #e6f0ff;
        --text-color: #2d3748;
        --text-secondary: #4a5568;
        --border-color: #e2e8f0;
        --border-radius: 4px;
        --transition: all 0.2s ease;
      }
      
      .selection-menu {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .selection-menu__header {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-color);
        font-weight: 600;
        color: var(--text-color);
      }
      
      .selection-menu__container {
        flex: 1;
        padding: 8px 0;
        overflow-y: auto;
      }
      
      .selection-menu__item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 8px 0;
        cursor: pointer;
      }
      
      
      .selection-menu__item--selected {
        background-color: var(--selected-color);
        color: var(--primary-color);
        font-weight: 500;
      }
      
      .selection-menu__item--level-1 {
        padding-left: 32px;
      }
      
      .selection-menu__item--level-2 {
        padding-left: 48px;
      }
      
      .selection-menu__item--level-3 {
        padding-left: 64px;
      }
    `;
    const container = document.createElement("div");
    container.className = "selection-menu";
    container.innerHTML = `
      <div class="selection-menu__wrapper">
        <div class="selection-menu__container">
          <collapsible-list id="menuList" class="selection-menu__list" aria-label="Menu" reverse-heading="${this._reverseHeading}">
            ${this.renderItems(this._data)}
          </collapsible-list>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
    this.setupEventListeners();
  }
  renderItems(items, level = 0) {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isSelected = this._selectedId === item.id;
      return `
        <collapsible-item 
          class="selection-menu__item selection-menu__item--level-${level}"
          value="${item.id}" 
          data-id="${item.id}" 
          level="${level}" 
          ${!hasChildren ? "no-children hide-icon" : ""} 
          reverse-heading="${this._reverseHeading}"
          ${isSelected ? "selected" : ""}
        >
          <span slot="header" class="selection-menu__item-header ${isSelected ? "selection-menu__item-header--selected" : ""}">
            ${item.name}
          </span>
          ${hasChildren ? `
            <collapsible-list class="selection-menu__list">
              ${this.renderItems(item.children, level + 1)}
            </collapsible-list>
          ` : ""}
        </collapsible-item>
      `;
    }).join("");
  }
  setupEventListeners() {
    const menuList = this.shadowRoot.getElementById("menuList");
    if (!menuList) {
      console.error("menuList element not found in shadow DOM");
      return;
    }
    this._boundHandleClick = this.handleItemClick.bind(this);
    menuList.addEventListener("click", this._boundHandleClick, true);
  }
  handleItemClick(event) {
    const item = event.target.closest("collapsible-item");
    if (!item) {
      return;
    }
    const itemId = item.getAttribute("data-id");
    if (!itemId) {
      return;
    }
    const itemData = this._findItemById(this._data, itemId);
    if (itemData && itemData.children && itemData.children.length > 0) {
      return;
    }
    this.setSelectedItem(itemId);
    const customEvent = new CustomEvent("item-selected", {
      detail: {
        id: itemId,
        item: itemData
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(customEvent);
    window.dispatchEvent(new CustomEvent("global-item-selected", {
      detail: {
        id: itemId,
        item: itemData
      }
    }));
  }
  // Helper method to find an item by ID in nested data
  _findItemById(items, id) {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = this._findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  // Public method to set the selected item by ID
  setSelectedItem(id) {
    if (id === this._selectedId) return false;
    if (this._selectedId) {
      const prevSelected = this.shadowRoot.querySelector(`collapsible-item[data-id="${this._selectedId}"]`);
      if (prevSelected) {
        prevSelected.removeAttribute("selected");
      }
    }
    this._selectedId = id;
    const newSelected = this.shadowRoot.querySelector(`collapsible-item[data-id="${id}"]`);
    if (newSelected) {
      newSelected.setAttribute("selected", "");
    }
    if (id) {
      this.setAttribute("value", id);
    } else {
      this.removeAttribute("value");
    }
    return true;
  }
  // Getter/setter for data property
  get data() {
    return this._data;
  }
  set data(value) {
    if (Array.isArray(value)) {
      this._data = value;
      this.render();
    } else if (typeof value === "string") {
      try {
        this._data = JSON.parse(value);
        this.render();
      } catch (e) {
        console.error("Invalid data format for selection-menu", e);
      }
    }
  }
  // Getter/setter for blockEventsOnParent property
  get blockEventsOnParent() {
    return this._blockEventsOnParent;
  }
  set blockEventsOnParent(value) {
    if (value !== void 0) {
      this._blockEventsOnParent = value;
      this.setAttribute("block-events-on-parent", value ? "" : null);
    }
    return this._blockEventsOnParent;
  }
  // Getter/setter for reverseHeading property
  get reverseHeading() {
    return this._reverseHeading;
  }
  set reverseHeading(value) {
    const newValue = value !== false && value !== "false" && value !== null;
    if (this._reverseHeading !== newValue) {
      this._reverseHeading = newValue;
      this.setAttribute("reverse-heading", newValue ? "" : null);
      this.render();
    }
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }
      
      #menuList {
        list-style: none;
        margin: 0;
        padding: 0;
      }
    `;
    const menuList = document.createElement("div");
    menuList.id = "menuList";
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(menuList);
    menuList.innerHTML = this.renderItems(this._data);
    this.setupEventListeners();
  }
}
if (!customElements.get("selection-menu")) {
  customElements.define("selection-menu", SelectionMenu);
}
export {
  SelectionMenu
};
//# sourceMappingURL=SelectionMenu-CfWl8hxy.js.map
