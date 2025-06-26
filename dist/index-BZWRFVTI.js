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
const CollapsibleList$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CollapsibleList
}, Symbol.toStringTag, { value: "Module" }));
class CollapsibleItem extends HTMLElement {
  static get observedAttributes() {
    return ["expanded", "reverse-heading", "hide-icon"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isExpanded = false;
    this._nestedList = null;
    this._showToggle = false;
    this._initialized = false;
    this._handleHeaderClick = this._handleHeaderClick.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }
  connectedCallback() {
    if (!this._initialized) {
      this._initializeComponent();
      this._initialized = true;
      const isExpanded = this.hasAttribute("expanded");
      this._isExpanded = isExpanded;
      if (this._nestedContent) {
        this._nestedContent.style.display = isExpanded ? "block" : "none";
      }
    }
    this._updateToggleVisibility();
    this._updateReverseHeading();
    this._updateAriaExpanded();
    if (this._toggleElement) {
      if (this.expanded) {
        this._toggleElement.classList.add("collapsible-item__toggle--expanded");
      } else {
        this._toggleElement.classList.remove("collapsible-item__toggle--expanded");
      }
    }
  }
  _initializeComponent() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = "";
    } else {
      this.attachShadow({ mode: "open" });
    }
    const content = document.createElement("div");
    content.className = "collapsible-item";
    this._headerElement = document.createElement("div");
    this._headerElement.className = "collapsible-item__header";
    this._headerElement.setAttribute("part", "header");
    let toggleContainer = null;
    if (!this.hasAttribute("hide-icon")) {
      toggleContainer = document.createElement("div");
      toggleContainer.className = "collapsible-item__toggle-container";
      this._toggleElement = document.createElement("button");
      this._toggleElement.className = "collapsible-item__toggle";
      this._toggleElement.setAttribute("aria-label", "Toggle visibility");
      this._toggleElement.setAttribute("aria-expanded", "false");
      this._toggleElement.innerHTML = "▼";
      toggleContainer.appendChild(this._toggleElement);
    }
    this._headerSlot = document.createElement("slot");
    this._headerSlot.name = "header";
    const headerContent = document.createElement("div");
    headerContent.className = "collapsible-item__content";
    headerContent.appendChild(this._headerSlot);
    if (toggleContainer) {
      this._headerElement.appendChild(toggleContainer);
    }
    this._headerElement.appendChild(headerContent);
    this._defaultSlot = document.createElement("slot");
    this._nestedContent = document.createElement("div");
    this._nestedContent.className = "collapsible-item__nested";
    this._nestedContent.style.display = "none";
    this._nestedContent.appendChild(this._defaultSlot);
    this._headerElement.addEventListener("click", this._handleHeaderClick);
    this._headerElement.addEventListener("keydown", this._handleKeyDown);
    if (this._toggleElement) {
      this._toggleElement.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }
    content.appendChild(this._headerElement);
    content.appendChild(this._nestedContent);
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        margin: 0;
        padding: 0;
      }

      .collapsible-item {
          display: flex;
          flex-direction: column;
          width: 100%;
      }
      
      .collapsible-item__header {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 0;
        padding: 0;
        background: none;
        border: none;
        font: inherit;
        color: inherit;
        cursor: pointer;
      }
      
      .collapsible-item__toggle-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        margin-right: 8px;
        
      }
      
      .collapsible-item__toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: none;
        border: none;
        cursor: pointer;
        transition: transform 0.2s ease-in-out;
        font-size: 0.8em;
        line-height: 1;
        color: inherit;
      }
      
      .collapsible-item__toggle--hidden {
        visibility: hidden;
        width: 0;
        margin: 0;
      }
      
      .collapsible-item__toggle--expanded {
        transform: rotate(180deg);
      }
      
      .collapsible-item__content {
        flex: 1 1 auto;
        min-width: 0; /* Allows content to shrink below its minimum content size */
        text-align: left;
        margin: 0;
        padding: 0;
        overflow: hidden; /* Ensures content doesn't overflow */
        display: flex;
        align-items: center;
      }
      
      .collapsible-item__content ::slotted(*) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; /* Add ellipsis for overflow text */
        text-overflow: ellipsis;
      }
      
      .collapsible-item__nested {
        margin: 0;
        padding: 0;
        display: block;
        overflow: hidden;
      }
      collapsible-item > collapsible-list {
        padding-left: 1rem;
      }
    `;
    this.shadowRoot.append(style, content);
  }
  _handleHeaderClick(event) {
    const interactiveElements = ["a", "button", "input", "select", "textarea"];
    if (event.target.closest(interactiveElements.join(","))) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.toggle();
  }
  _handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.toggle();
    }
  }
  _updateToggleVisibility() {
    if (!this._headerElement) return;
    const headerContent = this.shadowRoot.querySelector(".collapsible-item__content");
    const isNoChildren = this.hasAttribute("no-children");
    if (this.hasAttribute("hide-icon") || isNoChildren) {
      this._showToggle = false;
      if (this._toggleElement) {
        this._toggleElement.style.display = "none";
      }
      if (headerContent) {
        headerContent.style.marginLeft = "0";
        headerContent.style.paddingLeft = "0";
      }
      this._headerElement.style.paddingLeft = "0";
      this._headerElement.style.marginLeft = "0";
      return;
    }
    const hasNestedItems = this._nestedContent && this._nestedContent.children.length > 0;
    this._showToggle = hasNestedItems;
    if (this._toggleElement) {
      this._toggleElement.style.display = this._showToggle ? "inline-block" : "none";
      if (this.expanded) {
        this._toggleElement.classList.add("collapsible-item__toggle--expanded");
      } else {
        this._toggleElement.classList.remove("collapsible-item__toggle--expanded");
      }
    }
    if (this._showToggle && this._headerElement) {
      this._headerElement.setAttribute("role", "button");
      this._headerElement.setAttribute("tabindex", "0");
      this._headerElement.setAttribute("aria-expanded", this.expanded.toString());
      this._headerElement.classList.add("collapsible-item__header--clickable");
      if (this.expanded) {
        this._toggleElement.classList.add("collapsible-item__toggle--expanded");
      } else {
        this._toggleElement.classList.remove("collapsible-item__toggle--expanded");
      }
    } else {
      this._toggleElement.style.display = "none";
      this._toggleElement.classList.add("collapsible-item__toggle--hidden");
      this._headerElement.removeAttribute("role");
      this._headerElement.removeAttribute("tabindex");
      this._headerElement.removeAttribute("aria-expanded");
      this._headerElement.classList.remove("collapsible-item__header--clickable");
    }
  }
  get expanded() {
    return this._isExpanded;
  }
  set expanded(value) {
    const isExpanded = Boolean(value);
    if (this._isExpanded === isExpanded) return;
    this._isExpanded = isExpanded;
    if (this._nestedContent) {
      if (isExpanded) {
        this._nestedContent.style.display = "block";
        this._nestedContent.style.overflow = "hidden";
        this._nestedContent.style.height = "auto";
        const startHeight = this._nestedContent.offsetHeight;
        this._nestedContent.style.height = "0";
        requestAnimationFrame(() => {
          this._nestedContent.style.transition = "height 0.3s ease-in-out";
          this._nestedContent.style.height = `${startHeight}px`;
          setTimeout(() => {
            this._nestedContent.style.transition = "";
            this._nestedContent.style.height = "";
            this._nestedContent.style.overflow = "";
          }, 300);
        });
      } else {
        const startHeight = this._nestedContent.offsetHeight;
        this._nestedContent.style.height = `${startHeight}px`;
        this._nestedContent.style.overflow = "hidden";
        requestAnimationFrame(() => {
          this._nestedContent.style.transition = "height 0.3s ease-in-out";
          this._nestedContent.style.height = "0";
          setTimeout(() => {
            if (this._nestedContent) {
              this._nestedContent.style.display = "none";
              this._nestedContent.style.transition = "";
              this._nestedContent.style.height = "";
            }
          }, 300);
        });
      }
    }
    if (this._headerElement) {
      if (isExpanded) {
        this._headerElement.classList.add("collapsible-item__header--expanded");
      } else {
        this._headerElement.classList.remove("collapsible-item__header--expanded");
      }
      if (this._showToggle) {
        this._headerElement.setAttribute("aria-expanded", isExpanded.toString());
      }
    }
    if (this._toggleElement) {
      if (isExpanded) {
        this._toggleElement.classList.add("collapsible-item__toggle--expanded");
      } else {
        this._toggleElement.classList.remove("collapsible-item__toggle--expanded");
      }
    }
    this._dispatchEvents(isExpanded);
  }
  toggle(force) {
    const shouldExpand = force !== void 0 ? force : !this.expanded;
    this.expanded = shouldExpand;
    this._updateAriaExpanded();
    if (this._toggleElement) {
      if (shouldExpand) {
        this._toggleElement.classList.add("collapsible-item__toggle--expanded");
      } else {
        this._toggleElement.classList.remove("collapsible-item__toggle--expanded");
      }
    }
    this._dispatchEvents(shouldExpand);
  }
  _dispatchEvents(isExpanded) {
    this.dispatchEvent(new CustomEvent("toggle", {
      detail: { expanded: isExpanded },
      bubbles: true,
      composed: true
    }));
    const eventType = isExpanded ? "expanded" : "collapsed";
    this.dispatchEvent(new CustomEvent(eventType, {
      bubbles: true,
      composed: true
    }));
  }
  _updateAriaExpanded() {
    if (this._headerElement) {
      this._headerElement.setAttribute("aria-expanded", this._isExpanded.toString());
    }
  }
  _updateReverseHeading() {
    var _a, _b;
    const isReversed = this.hasAttribute("reverse-heading") && this.getAttribute("reverse-heading") !== "false";
    const header = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector(".collapsible-item__header");
    const toggle = (_b = this.shadowRoot) == null ? void 0 : _b.querySelector(".collapsible-item__toggle-container");
    if (header && toggle) {
      if (isReversed) {
        header.style.flexDirection = "row-reverse";
        toggle.style.margin = "0 0 0 8px";
      } else {
        header.style.flexDirection = "row";
        toggle.style.margin = "0 8px 0 0";
      }
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "expanded" && oldValue !== newValue) {
      this.expanded = newValue !== null;
      this._updateAriaExpanded();
    } else if (name === "reverse-heading") {
      this._updateReverseHeading();
    }
  }
}
if (!customElements.get("collapsible-item")) {
  customElements.define("collapsible-item", CollapsibleItem);
}
const CollapsibleItem$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CollapsibleItem
}, Symbol.toStringTag, { value: "Module" }));
let additionalComponents = {};
async function loadAdditionalComponents() {
  try {
    const selectionMenuModule = await import("./SelectionMenu-CfWl8hxy.js");
    additionalComponents.SelectionMenu = selectionMenuModule.default || selectionMenuModule;
  } catch (e) {
    console.warn("SelectionMenu component not found or failed to load", e);
  }
  try {
    const productLayoutModule = await import("./ProductLayout-DG3gJKwD.js");
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
  CollapsibleList$1 as c,
  CollapsibleItem$1 as d,
  getAdditionalComponents as g,
  loadAdditionalComponents as l,
  wrappers as w
};
//# sourceMappingURL=index-BZWRFVTI.js.map
