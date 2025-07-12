class c extends HTMLElement {
  static get observedAttributes() {
    return ["reverse-heading", "single-item", "accordion"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._isUpdating = !1, this._handleItemToggle = this._handleItemToggle.bind(this);
    const t = document.createElement("div"), e = document.createElement("slot"), i = document.createElement("style");
    i.textContent = `
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
      }`, t.appendChild(e), this.shadowRoot.append(i, t);
  }
  async connectedCallback() {
    this._initialized || (this._initializeComponent(), this._initialized = !0, await this._updateReverseHeading(), this.addEventListener("toggle", this._handleItemToggle), this.hasAttribute("accordion") && this._ensureOneItemExpanded()), this._setupMutationObserver();
  }
  _initializeComponent() {
    this.hasAttribute("role") || this.setAttribute("role", "list"), !this.hasAttribute("aria-label") && !this.hasAttribute("aria-labelledby") && console.warn("collapsible-list: Add an aria-label or aria-labelledby attribute for accessibility");
  }
  _setupMutationObserver() {
    this._observer = new MutationObserver(async (t) => {
      let e = !1;
      for (const i of t)
        if (i.type === "attributes" && i.attributeName === "reverse-heading") {
          e = !0;
          break;
        } else if (i.type === "childList") {
          for (const r of i.addedNodes)
            if (r.nodeType === Node.ELEMENT_NODE && (r.matches("collapsible-item") || r.matches("collapsible-list"))) {
              e = !0;
              break;
            }
          if (e) break;
        }
      e && await this._updateReverseHeading();
    }), this._observer.observe(this, {
      attributes: !0,
      attributeFilter: ["reverse-heading"],
      childList: !0,
      subtree: !0
    });
  }
  /**
   * Updates the reverse heading state for all child collapsible items
   * @private
   */
  async _updateReverseHeading() {
    if (!this._isUpdating) {
      this._isUpdating = !0;
      try {
        const t = this.hasAttribute("reverse-heading") && this.getAttribute("reverse-heading") !== "false";
        this._observer && this._observer.disconnect();
        const e = async (o) => {
          for (const s of o) {
            t ? s.setAttribute("reverse-heading", "") : s.removeAttribute("reverse-heading");
            const l = s.querySelectorAll(":scope > collapsible-item");
            l.length > 0 && await e(Array.from(l));
            const a = s.querySelectorAll(":scope > collapsible-list");
            a.length > 0 && await i(Array.from(a));
          }
        }, i = async (o) => {
          for (const s of o) {
            if (s === this) continue;
            t ? s.setAttribute("reverse-heading", "") : s.removeAttribute("reverse-heading");
            const l = s.querySelectorAll(":scope > collapsible-item");
            l.length > 0 && await e(Array.from(l));
            const a = s.querySelectorAll(":scope > collapsible-list");
            a.length > 0 && await i(Array.from(a));
          }
        }, r = this.querySelectorAll(":scope > collapsible-item");
        r.length > 0 && await e(Array.from(r));
        const n = this.querySelectorAll(":scope > collapsible-list");
        n.length > 0 && await i(Array.from(n)), this.shadowRoot && this.shadowRoot.offsetHeight;
      } catch (t) {
        console.error("Error updating reverse heading:", t);
      } finally {
        this._observer && this._observer.observe(this, {
          attributes: !0,
          attributeFilter: ["reverse-heading"],
          childList: !0,
          subtree: !0
        }), this._isUpdating = !1;
      }
    }
  }
  _handleItemToggle(t) {
    if (this._isUpdating) return;
    const e = t.target;
    e.parentElement === this && (this._isUpdating = !0, this.hasAttribute("accordion") ? e.expanded && this._closeOtherItems(e) : this.hasAttribute("single-item") && e.expanded && this._closeOtherItems(e), this._isUpdating = !1);
  }
  _closeOtherItems(t) {
    if (this.closest("image-collection"))
      return;
    this.querySelectorAll("collapsible-item").forEach((i) => {
      i !== t && (i.expanded = !1);
    });
  }
  _getOpenItems() {
    return Array.from(this.querySelectorAll("collapsible-item[expanded]"));
  }
  _ensureOneItemExpanded() {
    if (!this.hasAttribute("accordion")) return;
    if (this._getOpenItems().length === 0) {
      const e = this.querySelector("collapsible-item");
      e && e.setAttribute("expanded", "");
    }
  }
}
customElements.get("collapsible-list") || customElements.define("collapsible-list", c);
export {
  c as CollapsibleList
};
//# sourceMappingURL=CollapsibleList.js.map
