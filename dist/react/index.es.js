import React, { forwardRef, useRef, useImperativeHandle } from "react";
let IconLabel$1 = class IconLabel extends HTMLElement {
  static get observedAttributes() {
    return ["icon", "label", "reverse"];
  }
  constructor() {
    super();
    this._icon = "";
    this._label = "";
    this._reverse = false;
  }
  connectedCallback() {
    this._render();
  }
  get icon() {
    return this._icon;
  }
  set icon(value) {
    this._icon = value || "";
    this._render();
  }
  get label() {
    return this._label;
  }
  set label(value) {
    this._label = value || "";
    this._render();
  }
  get reverse() {
    return this._reverse;
  }
  set reverse(value) {
    this._reverse = value !== null && value !== "false";
    this._render();
  }
  _render() {
    const container = document.createElement("span");
    container.style.display = "inline-flex";
    container.style.alignItems = "center";
    container.style.gap = "0.5rem";
    container.style.fontFamily = "inherit";
    container.style.color = "currentColor";
    if (this._reverse) {
      container.style.flexDirection = "row-reverse";
    }
    if (this._icon) {
      const isImage = this._icon.startsWith("data:") || this._icon.startsWith("http") || this._icon.startsWith("/") || /\.(png|jpg|jpeg|svg|gif|webp)(\?.*)?$/i.test(this._icon);
      const icon = isImage ? document.createElement("img") : document.createElement("span");
      icon.style.display = "inline-flex";
      icon.style.alignItems = "center";
      icon.style.justifyContent = "center";
      icon.style.width = "1em";
      icon.style.height = "1em";
      if (isImage) {
        icon.src = this._icon;
        icon.alt = "";
        icon.loading = "lazy";
        icon.style.objectFit = "contain";
      } else {
        icon.textContent = this._icon;
        icon.style.fontSize = "1em";
        icon.style.lineHeight = "1";
      }
      container.appendChild(icon);
    }
    if (this._label) {
      const label = document.createElement("span");
      label.textContent = this._label;
      container.appendChild(label);
    }
    this.innerHTML = "";
    this.appendChild(container);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "icon") {
      this._icon = newValue || "";
    } else if (name === "label") {
      this._label = newValue || "";
    } else if (name === "reverse") {
      this._reverse = newValue !== null && newValue !== "false";
    }
    this._render();
  }
};
if (!customElements.get("icon-label")) {
  customElements.define("icon-label", IconLabel$1);
}
let CollapsibleItem$1 = class CollapsibleItem extends HTMLLIElement {
  static get observedAttributes() {
    return ["expanded", "icon", "label", "removeshift", "hide-icon"];
  }
  constructor() {
    super();
    this._isExpanded = false;
    this._handleClick = this._handleClick.bind(this);
    this._header = null;
    this._content = null;
    this._initialRender = true;
    this._removeShift = false;
    this.rendered = false;
    this.classList.add("collapsible-item");
    if (this.hasAttribute("expanded")) {
      this._isExpanded = true;
      this.classList.add("collapsible-item--expanded");
    }
    if (this.hasAttribute("removeshift")) {
      this.classList.add("collapsible-item--no-padding");
    }
  }
  connectedCallback() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "listitem");
    }
    if (!this.rendered) {
      this._render();
      this.rendered = true;
      this._addEventListeners();
      this._updateContentVisibility();
    }
    this.classList.add("collapsible-item");
    if (this.hasAttribute("expanded")) {
      this._isExpanded = true;
      this.classList.add("collapsible-item--expanded");
    } else {
      this._isExpanded = false;
      this.classList.remove("collapsible-item--expanded");
    }
  }
  disconnectedCallback() {
    this._removeEventListeners();
  }
  _addEventListeners() {
    this.addEventListener("click", this._handleClick);
  }
  _removeEventListeners() {
    this.removeEventListener("click", this._handleClick);
  }
  _handleClick(event) {
    const header = event.target.closest(".collapsible-item__header");
    if (!header) return;
    event.preventDefault();
    event.stopPropagation();
    const isExpanding = !this.hasAttribute("expanded");
    if (isExpanding) {
      this.setAttribute("expanded", "");
    } else {
      this.removeAttribute("expanded");
    }
    this._isExpanded = isExpanding;
    this._updateContentVisibility();
    this.dispatchEvent(new CustomEvent("toggle", {
      detail: {
        expanded: isExpanding
      },
      bubbles: true,
      composed: true
    }));
  }
  _createHeader() {
    const header = document.createElement("div");
    header.className = "collapsible-item__header";
    const contentWrapper = document.createElement("div");
    contentWrapper.style.display = "flex";
    contentWrapper.style.alignItems = "center";
    contentWrapper.style.flex = "1";
    const hideIcon = this.hasAttribute("hide-icon");
    const icon = this.getAttribute("icon");
    if (icon && !hideIcon) {
      const iconEl = document.createElement("span");
      iconEl.className = "collapsible-item__icon";
      iconEl.textContent = icon;
      iconEl.style.marginRight = "0.5rem";
      contentWrapper.appendChild(iconEl);
    }
    const label = this.getAttribute("label") || "";
    if (label) {
      const labelEl = document.createElement("span");
      labelEl.className = "collapsible-item__label";
      labelEl.textContent = label;
      contentWrapper.appendChild(labelEl);
    }
    header.appendChild(contentWrapper);
    return header;
  }
  _render() {
    if (!this._isRendering) {
      this._isRendering = true;
      const existingContent = [];
      Array.from(this.children).forEach((child) => {
        if (child !== this._header && child !== this._content) {
          existingContent.push(child);
        }
      });
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
      this._header = this._createHeader();
      this.appendChild(this._header);
      if (this._header) {
        this._header.setAttribute("role", "button");
        this._header.setAttribute("aria-expanded", this._isExpanded ? "true" : "false");
        this._header.setAttribute("tabindex", "0");
        this._header.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this._toggleExpanded();
          }
        });
      }
      this._content = this._createContent();
      if (this._content) {
        this.appendChild(this._content);
        existingContent.forEach((child) => {
          this._content.appendChild(child);
        });
      }
      this.setAttribute("role", "listitem");
      this._updateContentVisibility();
      this.rendered = true;
      this._isRendering = false;
    }
  }
  _createContent() {
    const content = document.createElement("div");
    content.className = "collapsible-item__content";
    const headerElements = this.querySelectorAll(".collapsible-item__header, .collapsible-item__label, .collapsible-item__icon");
    const headerElementSet = new Set(headerElements);
    const filteredChildren = Array.from(this.childNodes).filter((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return !headerElementSet.has(node) && !node.closest(".collapsible-item__header");
      }
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim() !== "" && !node.textContent.includes("▶") && !node.textContent.includes("▼");
      }
      return false;
    });
    filteredChildren.forEach((child) => {
      content.appendChild(child.cloneNode(true));
    });
    return content;
  }
  get expanded() {
    return this._isExpanded;
  }
  set expanded(value) {
    if (this._isExpanded === value) return;
    this._isExpanded = value;
    if (this._isExpanded) {
      this.setAttribute("expanded", "");
    } else {
      this.removeAttribute("expanded");
    }
    this._updateContentVisibility();
    this.dispatchEvent(new CustomEvent("toggle", {
      detail: {
        expanded: this._isExpanded
      },
      bubbles: true,
      composed: true
    }));
  }
  _toggleExpanded() {
    this._isExpanded = !this._isExpanded;
    if (this._isExpanded) {
      this.setAttribute("expanded", "");
    } else {
      this.removeAttribute("expanded");
    }
    this._updateContentVisibility();
    this.dispatchEvent(new CustomEvent("toggle", {
      detail: {
        expanded: this._isExpanded
      },
      bubbles: true,
      composed: true
    }));
  }
  _updateContentVisibility() {
    if (!this._content || !this._header) return;
    const hideIcon = this.hasAttribute("hide-icon");
    if (this._isExpanded) {
      this._content.classList.add("collapsible-item__content--expanded");
      this._content.style.display = "block";
      this._header.setAttribute("aria-expanded", "true");
      this.classList.add("collapsible-item--expanded");
      if (!hideIcon) {
        this.setAttribute("icon", "▼");
      }
    } else {
      this._content.classList.remove("collapsible-item__content--expanded");
      this._content.style.display = "none";
      this._header.setAttribute("aria-expanded", "false");
      this.classList.remove("collapsible-item--expanded");
      if (!hideIcon) {
        this.setAttribute("icon", "▶");
      }
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "removeshift") {
      this._removeShift = newValue !== null;
      if (this._removeShift) {
        this.classList.add("collapsible-item--no-padding");
      } else {
        this.classList.remove("collapsible-item--no-padding");
      }
    } else if (name === "hide-icon" && this._header) {
      const iconEl = this._header.querySelector(".collapsible-item__icon");
      if (newValue !== null) {
        if (iconEl) {
          iconEl.remove();
        }
      } else if (this.hasAttribute("icon")) {
        if (!iconEl) {
          const icon = this.getAttribute("icon");
          const newIconEl = document.createElement("span");
          newIconEl.className = "collapsible-item__icon";
          newIconEl.textContent = icon;
          newIconEl.style.marginRight = "0.5rem";
          const contentWrapper = this._header.firstElementChild;
          if (contentWrapper) {
            contentWrapper.insertBefore(newIconEl, contentWrapper.firstChild);
          }
        }
      }
    } else if (name === "expanded") {
      const wasExpanded = this._isExpanded;
      this._isExpanded = newValue !== null;
      if (this._isExpanded !== wasExpanded) {
        this._updateContentVisibility();
      }
    } else if (name === "icon" && this._header) {
      let iconEl = this._header.querySelector(".collapsible-item__icon");
      if (newValue) {
        if (!iconEl) {
          iconEl = document.createElement("span");
          iconEl.className = "collapsible-item__icon";
          this._header.insertBefore(iconEl, this._header.firstChild);
        }
        iconEl.textContent = newValue;
      } else if (iconEl) {
        this._header.removeChild(iconEl);
      }
    } else if (name === "label" && this._header) {
      let labelEl = this._header.querySelector(".collapsible-item__label");
      if (labelEl) {
        labelEl.textContent = newValue || "";
      } else if (newValue) {
        labelEl = document.createElement("span");
        labelEl.className = "collapsible-item__label";
        labelEl.textContent = newValue;
        this._header.appendChild(labelEl);
      }
    }
  }
};
const elementName = "collapsible-item";
if (typeof window !== "undefined" && window.customElements) {
  if (window.customElements.get(elementName)) {
    window.customElements.get(elementName);
    delete window.customElements._elements[elementName];
  }
  window.customElements.define(elementName, CollapsibleItem$1, {
    extends: "li"
  });
}
const CollapsibleItem$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CollapsibleItem: CollapsibleItem$1
}, Symbol.toStringTag, { value: "Module" }));
let CollapsibleList$1 = class CollapsibleList extends HTMLElement {
  static get observedAttributes() {
    return ["reverse-heading", "single-item", "accordion"];
  }
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
    this._isUpdating = false;
    this._handleItemToggle = this._handleItemToggle.bind(this);
    const container = document.createElement("div");
    const slot = document.createElement("slot");
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        --indent-size: 1.5rem;
      }
      
      ::slotted(collapsible-item) {
        display: block;
        margin: 0.25rem 0;
        padding: 0;
        width: 100%;
      }
      
      /* Nested lists should have a border */
      ::slotted(collapsible-list) {
        border-left: 1px solid #e0e0e0;
        margin-left: 0.5rem;
        padding-left: 0.5rem;
      }
      
      /* Style for the header in collapsible items */
      .collapsible-item__header {
        display: flex;
        align-items: center;
        width: 100%;
        flex-direction: row;
      }
      
      /* Toggle container styles */
      .collapsible-item__toggle-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--toggle-size, 24px);
        height: var(--toggle-size, 24px);
        margin: var(--toggle-margin, 0 8px 0 0);
        flex-shrink: 0;
      }`;
    container.appendChild(slot);
    this.shadowRoot.append(style, container);
  }
  async connectedCallback() {
    if (!this._initialized) {
      this._initializeComponent();
      this._initialized = true;
      await this._updateReverseHeading();
      this.addEventListener("toggle", this._handleItemToggle);
      if (this.hasAttribute("accordion")) {
        this._ensureOneItemExpanded();
      }
    }
    this._setupMutationObserver();
  }
  _initializeComponent() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "list");
    }
    if (!this.hasAttribute("aria-label") && !this.hasAttribute("aria-labelledby")) {
      console.warn("collapsible-list: Add an aria-label or aria-labelledby attribute for accessibility");
    }
  }
  _setupMutationObserver() {
    this._observer = new MutationObserver(async (mutations) => {
      let shouldUpdate = false;
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "reverse-heading") {
          shouldUpdate = true;
          break;
        } else if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && (node.matches("collapsible-item") || node.matches("collapsible-list"))) {
              shouldUpdate = true;
              break;
            }
          }
          if (shouldUpdate) break;
        }
      }
      if (shouldUpdate) {
        await this._updateReverseHeading();
      }
    });
    this._observer.observe(this, {
      attributes: true,
      attributeFilter: ["reverse-heading"],
      childList: true,
      subtree: true
    });
  }
  /**
   * Updates the reverse heading state for all child collapsible items
   * @private
   */
  async _updateReverseHeading() {
    if (this._isUpdating) return;
    this._isUpdating = true;
    try {
      const isReversed = this.hasAttribute("reverse-heading") && this.getAttribute("reverse-heading") !== "false";
      if (this._observer) {
        this._observer.disconnect();
      }
      const processItems = async (items2) => {
        for (const item of items2) {
          if (isReversed) {
            item.setAttribute("reverse-heading", "");
          } else {
            item.removeAttribute("reverse-heading");
          }
          const nestedItems = item.querySelectorAll(":scope > collapsible-item");
          if (nestedItems.length > 0) {
            await processItems(Array.from(nestedItems));
          }
          const nestedLists = item.querySelectorAll(":scope > collapsible-list");
          if (nestedLists.length > 0) {
            await processLists(Array.from(nestedLists));
          }
        }
      };
      const processLists = async (lists2) => {
        for (const list of lists2) {
          if (list === this) continue;
          if (isReversed) {
            list.setAttribute("reverse-heading", "");
          } else {
            list.removeAttribute("reverse-heading");
          }
          const nestedItems = list.querySelectorAll(":scope > collapsible-item");
          if (nestedItems.length > 0) {
            await processItems(Array.from(nestedItems));
          }
          const nestedLists = list.querySelectorAll(":scope > collapsible-list");
          if (nestedLists.length > 0) {
            await processLists(Array.from(nestedLists));
          }
        }
      };
      const items = this.querySelectorAll(":scope > collapsible-item");
      if (items.length > 0) {
        await processItems(Array.from(items));
      }
      const lists = this.querySelectorAll(":scope > collapsible-list");
      if (lists.length > 0) {
        await processLists(Array.from(lists));
      }
      if (this.shadowRoot) {
        this.shadowRoot.offsetHeight;
      }
    } catch (error) {
      console.error("Error updating reverse heading:", error);
    } finally {
      if (this._observer) {
        this._observer.observe(this, {
          attributes: true,
          attributeFilter: ["reverse-heading"],
          childList: true,
          subtree: true
        });
      }
      this._isUpdating = false;
    }
  }
  _handleItemToggle(e) {
    if (this._isUpdating) return;
    const target = e.target;
    if (target.parentElement === this) {
      this._isUpdating = true;
      if (this.hasAttribute("accordion")) {
        if (target.expanded) {
          this._closeOtherItems(target);
        }
      } else if (this.hasAttribute("single-item")) {
        if (target.expanded) {
          this._closeOtherItems(target);
        }
      }
      this._isUpdating = false;
    }
  }
  _closeOtherItems(exceptItem) {
    if (this.closest("image-collection")) {
      return;
    }
    const items = this.querySelectorAll("collapsible-item");
    items.forEach((item) => {
      if (item !== exceptItem) {
        item.expanded = false;
      }
    });
  }
  _getOpenItems() {
    return Array.from(this.querySelectorAll("collapsible-item[expanded]"));
  }
  _ensureOneItemExpanded() {
    if (!this.hasAttribute("accordion")) return;
    const openItems = this._getOpenItems();
    if (openItems.length === 0) {
      const firstItem = this.querySelector("collapsible-item");
      if (firstItem) {
        firstItem.setAttribute("expanded", "");
      }
    }
  }
};
if (!customElements.get("collapsible-list")) {
  customElements.define("collapsible-list", CollapsibleList$1);
}
let SelectionMenu$1 = class SelectionMenu extends HTMLElement {
  static get observedAttributes() {
    return ["items", "selected"];
  }
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
    this._items = [];
    this._selectedId = null;
    this._boundOnItemClick = this._onItemClick.bind(this);
    Promise.resolve().then(() => CollapsibleItem$2);
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
          detail: {
            id: itemId
          },
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
        detail: {
          expanded: !isExpanded
        },
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
};
if (!customElements.get("selection-menu")) {
  customElements.define("selection-menu", SelectionMenu$1);
}
let ImageCollection$1 = class ImageCollection extends HTMLElement {
  static get observedAttributes() {
    return ["images"];
  }
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
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
    let index2 = -1;
    let wasExpanded = false;
    try {
      const target = event.composedPath().find((node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute && node.getAttribute("is") === "collapsible-item");
      if (!target) {
        return;
      }
      const allItems = Array.from(this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'));
      index2 = allItems.indexOf(target);
      if (index2 === -1) {
        return;
      }
      if (index2 === this._currentOpenIndex) {
        return;
      }
      wasExpanded = target.expanded;
      allItems.forEach((item, i) => {
        if (i !== index2 && item.expanded) {
          item.expanded = false;
        }
      });
      if (index2 === this._currentOpenIndex) {
        target.expanded = false;
        this._currentOpenIndex = -1;
      } else {
        target.expanded = true;
        this._currentOpenIndex = index2;
      }
    } finally {
      this._isHandlingToggle = false;
    }
    this.dispatchEvent(new CustomEvent("toggle", {
      detail: {
        index: index2,
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
    const index2 = items.indexOf(targetItem);
    if (index2 === -1) return;
    if (!event.detail.expanded) {
      if (this._currentOpenIndex === index2) {
        this._currentOpenIndex = -1;
      }
      return;
    }
    if (this._currentOpenIndex !== -1 && this._currentOpenIndex !== index2) {
      const previousItem = items[this._currentOpenIndex];
      if (previousItem) {
        previousItem.toggle(false);
      }
    }
    this._currentOpenIndex = index2;
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
                    ${this._images.map((image, index2) => `
                        <li is="collapsible-item" 
                            label="${image.title}" 
                            ${image.removeshift ? 'removeshift="true"' : ""}
                            ${this._currentOpenIndex === index2 ? "expanded" : ""}
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
};
if (!customElements.get("image-collection")) {
  customElements.define("image-collection", ImageCollection$1);
}
function defineCustomElements() {
  customElements.define("collapsible-list", CollapsibleList$1);
  customElements.define("collapsible-item", CollapsibleItem$1, {
    extends: "li"
  });
  customElements.define("icon-label", IconLabel$1);
  customElements.define("selection-menu", SelectionMenu$1);
  customElements.define("image-collection", ImageCollection$1);
  customElements.define("product-layout", class extends HTMLElement {
    constructor() {
      super();
    }
  });
  return Promise.all([customElements.whenDefined("collapsible-list"), customElements.whenDefined("collapsible-item"), customElements.whenDefined("icon-label"), customElements.whenDefined("selection-menu"), customElements.whenDefined("image-collection"), customElements.whenDefined("product-layout")]);
}
if (typeof window !== "undefined" && !window.__GENERIC_WEBCOMPONENTS_DEFINED__) {
  window.__GENERIC_WEBCOMPONENTS_DEFINED__ = true;
  defineCustomElements().catch(console.error);
}
defineCustomElements().catch(console.error);
const resolveIconPath = (icon) => {
  if (!icon) return "";
  if (icon.startsWith("http") || icon.startsWith("data:") || icon.startsWith("blob:")) {
    return icon;
  }
  return icon;
};
const createReactWrapper = (tagName) => {
  const Component = forwardRef(({
    children,
    style,
    className,
    ...props
  }, ref) => {
    const elementRef = useRef(null);
    useImperativeHandle(ref, () => ({
      ...elementRef.current || {}
      // Add any component-specific methods here
    }));
    if (tagName === "icon-label") {
      return React.createElement(tagName, {
        ref: (el) => {
          elementRef.current = el;
          if (ref) {
            if (typeof ref === "function") {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
          }
        },
        ...props,
        class: className,
        style: {
          "--icon-size": "24px",
          // Default size, can be overridden by style prop
          ...style || {}
        },
        "icon": props.icon ? resolveIconPath(props.icon) : void 0,
        "label": props.label || ""
      }, children);
    }
    const elementProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (key.startsWith("on") && key[2] === key[2].toUpperCase()) {
        const eventName = key[2].toLowerCase() + key.slice(3);
        return {
          ...acc,
          [eventName]: value
        };
      }
      if (key === "className") {
        return {
          ...acc,
          class: value
        };
      }
      if (key === "style" && typeof value === "object") {
        return {
          ...acc,
          style: value
        };
      }
      if (key === "icon") {
        return {
          ...acc,
          icon: resolveIconPath(value)
        };
      }
      return {
        ...acc,
        [key]: value
      };
    }, {});
    const elementPropsWithRef = {
      ...elementProps,
      ref: (element) => {
        if (element) {
          elementRef.current = element;
          if (typeof ref === "function") {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        }
      }
    };
    return React.createElement(tagName, elementPropsWithRef, children);
  });
  Component.displayName = tagName;
  return Component;
};
const CollapsibleList2 = createReactWrapper("collapsible-list");
const CollapsibleItem2 = createReactWrapper("collapsible-item");
const IconLabel2 = createReactWrapper("icon-label");
const SelectionMenu2 = createReactWrapper("selection-menu");
const ImageCollection2 = createReactWrapper("image-collection");
const ProductLayout = createReactWrapper("product-layout");
const index = {
  CollapsibleList: CollapsibleList2,
  CollapsibleItem: CollapsibleItem2,
  IconLabel: IconLabel2,
  SelectionMenu: SelectionMenu2,
  ImageCollection: ImageCollection2,
  ProductLayout,
  defineCustomElements
};
export {
  CollapsibleItem2 as CollapsibleItem,
  CollapsibleList2 as CollapsibleList,
  IconLabel2 as IconLabel,
  ImageCollection2 as ImageCollection,
  ProductLayout,
  SelectionMenu2 as SelectionMenu,
  index as default,
  defineCustomElements
};
//# sourceMappingURL=index.es.js.map
