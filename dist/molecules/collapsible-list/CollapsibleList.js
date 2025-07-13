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
export {
  CollapsibleList
};
//# sourceMappingURL=CollapsibleList.js.map
