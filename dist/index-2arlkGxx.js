import { forwardRef, useRef, useEffect } from "react";
class CollapsibleList extends HTMLElement {
  static get observedAttributes() {
    return ["reverse-heading", "single-item", "accordion"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
}
if (!customElements.get("collapsible-list")) {
  customElements.define("collapsible-list", CollapsibleList);
}
class IconLabel extends HTMLElement {
  static get observedAttributes() {
    return ["icon", "label", "reverse"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._icon = "";
    this._label = "";
    this._reverse = false;
    this._initialized = false;
  }
  connectedCallback() {
    if (!this._initialized) {
      this._initializeComponent();
      this._initialized = true;
    }
    this._render();
  }
  _initializeComponent() {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: inline-flex;
        align-items: center;
        font-family: inherit;
        color: currentColor;
      }

      .icon-label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .icon-label--reverse {
        flex-direction: row-reverse;
      }

      .icon-label__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1em;
        height: 1em;
      }
      
      .icon-label__icon img,
      .icon-label__char {
        width: 1em;
        height: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .icon-label__char {
        font-size: 1em;
        line-height: 1;
      }
    `;
    const container = document.createElement("span");
    container.className = "icon-label";
    container.setAttribute("part", "container");
    const iconSlot = document.createElement("slot");
    iconSlot.name = "icon";
    iconSlot.className = "icon-label__icon";
    iconSlot.setAttribute("part", "icon");
    const labelSlot = document.createElement("slot");
    labelSlot.className = "icon-label__label";
    labelSlot.setAttribute("part", "label");
    container.appendChild(iconSlot);
    container.appendChild(labelSlot);
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
    this._container = container;
    this._iconSlot = iconSlot;
    this._labelSlot = labelSlot;
  }
  _render() {
    if (!this._initialized) return;
    this._container.className = "icon-label";
    if (this._reverse) {
      this._container.classList.add("icon-label--reverse");
    }
    if (this._icon && this._iconSlot) {
      this._iconSlot.innerHTML = "";
      const isIconChar = this._icon.length === 1 || this._icon.length === 2 && this._icon.codePointAt(0) > 65535;
      if (isIconChar) {
        const charSpan = document.createElement("span");
        charSpan.className = "icon-label__char";
        charSpan.textContent = this._icon;
        this._iconSlot.appendChild(charSpan);
      } else {
        const img = document.createElement("img");
        img.src = this._icon;
        img.alt = "";
        this._iconSlot.appendChild(img);
      }
    }
    const labelText = this._label || this.textContent.trim();
    if (labelText && this._labelSlot) {
      this._labelSlot.textContent = "";
      if (!this._label && this.textContent.trim()) {
        while (this.firstChild) {
          this._labelSlot.appendChild(this.firstChild);
        }
      } else {
        this._labelSlot.textContent = labelText;
      }
    }
  }
  // Getters and setters for properties
  get icon() {
    return this._icon;
  }
  set icon(value) {
    this._icon = value;
    this.setAttribute("icon", value);
  }
  get label() {
    return this._label || this.textContent.trim();
  }
  set label(value) {
    this._label = value;
    if (this._labelSlot) {
      this._labelSlot.textContent = value;
    }
  }
  get reverse() {
    return this._reverse;
  }
  set reverse(value) {
    this._reverse = value !== null && value !== false;
    this._render();
  }
  // Handle attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
      case "icon":
        this._icon = newValue || "";
        break;
      case "label":
        this._label = newValue || "";
        if (this._labelSlot) {
          this._labelSlot.textContent = this._label;
        }
        break;
      case "reverse":
        this._reverse = newValue !== null;
        this._render();
        break;
    }
  }
}
if (!customElements.get("icon-label")) {
  customElements.define("icon-label", IconLabel);
}
class CollapsibleItem extends HTMLLIElement {
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
      detail: { expanded: isExpanding },
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
      detail: { expanded: this._isExpanded },
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
      detail: { expanded: this._isExpanded },
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
}
const elementName = "collapsible-item";
if (typeof window !== "undefined" && window.customElements) {
  if (window.customElements.get(elementName)) {
    window.customElements.get(elementName);
    delete window.customElements._elements[elementName];
  }
  window.customElements.define(elementName, CollapsibleItem, { extends: "li" });
}
const CollapsibleItem$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CollapsibleItem
}, Symbol.toStringTag, { value: "Module" }));
let additionalComponents = {};
async function loadAdditionalComponents() {
  try {
    const selectionMenuModule = await import("./SelectionMenu-jDr1DbM1.js");
    additionalComponents.SelectionMenu = selectionMenuModule.default || selectionMenuModule;
  } catch (e) {
    console.warn("SelectionMenu component not found or failed to load", e);
  }
  try {
    const productLayoutModule = await import("./ProductLayout-7yS6X1oE.js");
    additionalComponents.ProductLayout = productLayoutModule.default || productLayoutModule;
  } catch (e) {
    console.warn("ProductLayout component not found or failed to load", e);
  }
  return additionalComponents;
}
function getAdditionalComponents() {
  return additionalComponents;
}
const webComponents = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CollapsibleItem,
  CollapsibleList,
  getAdditionalComponents,
  loadAdditionalComponents
}, Symbol.toStringTag, { value: "Module" }));
const wrappers = {};
Object.entries(webComponents).forEach(([componentName, webComponent]) => {
  if (typeof webComponent === "function" && webComponent.name) {
    const ReactComponent = forwardRef(({ children, ...props }, ref) => {
      const elementRef = useRef(null);
      const eventHandlers = useRef({});
      useEffect(() => {
        const element = elementRef.current;
        const currentEventHandlers = {};
        Object.entries(props).forEach(([key, value]) => {
          if (typeof value === "function" && key.startsWith("on")) {
            const eventName = key.substring(2).toLowerCase();
            const handler = (e) => {
              value(e);
            };
            element.addEventListener(eventName, handler);
            currentEventHandlers[eventName] = handler;
          }
        });
        eventHandlers.current = currentEventHandlers;
        return () => {
          Object.entries(eventHandlers.current).forEach(([eventName, handler]) => {
            element.removeEventListener(eventName, handler);
          });
        };
      }, [props]);
      const elementProps = Object.entries(props).reduce((acc, [key, value]) => {
        if (!(typeof value === "function" && key.startsWith("on"))) {
          acc[key] = value;
        }
        return acc;
      }, {});
      useEffect(() => {
        if (ref) {
          if (typeof ref === "function") {
            ref(elementRef.current);
          } else {
            ref.current = elementRef.current;
          }
        }
      }, [ref]);
      const TagName = webComponent.is || componentName.toLowerCase();
      return /* @__PURE__ */ React.createElement(TagName, { ref: elementRef, ...elementProps }, children);
    });
    ReactComponent.displayName = componentName;
    wrappers[componentName] = ReactComponent;
  }
});
const VuePlugin = {
  install(app) {
    Object.entries(webComponents).forEach(([componentName, webComponent]) => {
      if (typeof webComponent === "function" && webComponent.name) {
        const tagName = webComponent.is || componentName.toLowerCase();
        const vueComponent = {
          name: componentName,
          inheritAttrs: false,
          emits: [],
          // Will be populated with event names
          props: {},
          render() {
            const attrs = Object.entries(this.$attrs).reduce((acc, [key, value]) => {
              const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              acc[camelKey] = value;
              return acc;
            }, {});
            const on = {};
            Object.keys(this.$listeners).forEach((event) => {
              on[event] = this.$listeners[event];
            });
            return this.$createElement(
              tagName,
              {
                attrs,
                on,
                ref: "webComponent"
              },
              this.$slots.default
            );
          }
        };
        app.component(componentName, vueComponent);
      }
    });
  }
};
const Components = {
  // Core components are already available via default export
  ...getAdditionalComponents(),
  // Method to load additional components
  async load() {
    await loadAdditionalComponents();
    Object.assign(this, getAdditionalComponents());
    return this;
  }
};
if (typeof window !== "undefined") {
  Components.load().catch(console.error);
}
export {
  Components as C,
  VuePlugin as V,
  CollapsibleList as a,
  CollapsibleItem as b,
  CollapsibleItem$1 as c,
  getAdditionalComponents as g,
  loadAdditionalComponents as l,
  wrappers as w
};
//# sourceMappingURL=index-2arlkGxx.js.map
