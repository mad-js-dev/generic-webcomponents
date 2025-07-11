class m extends HTMLElement {
  static get observedAttributes() {
    return ["reverse-heading", "single-item", "accordion"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._isUpdating = !1, this._handleItemToggle = this._handleItemToggle.bind(this);
    const e = document.createElement("div"), t = document.createElement("slot"), i = document.createElement("style");
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
      }`, e.appendChild(t), this.shadowRoot.append(i, e);
  }
  async connectedCallback() {
    this._initialized || (this._initializeComponent(), this._initialized = !0, await this._updateReverseHeading(), this.addEventListener("toggle", this._handleItemToggle), this.hasAttribute("accordion") && this._ensureOneItemExpanded()), this._setupMutationObserver();
  }
  _initializeComponent() {
    this.hasAttribute("role") || this.setAttribute("role", "list"), !this.hasAttribute("aria-label") && !this.hasAttribute("aria-labelledby") && console.warn("collapsible-list: Add an aria-label or aria-labelledby attribute for accessibility");
  }
  _setupMutationObserver() {
    this._observer = new MutationObserver(async (e) => {
      let t = !1;
      for (const i of e)
        if (i.type === "attributes" && i.attributeName === "reverse-heading") {
          t = !0;
          break;
        } else if (i.type === "childList") {
          for (const s of i.addedNodes)
            if (s.nodeType === Node.ELEMENT_NODE && (s.matches("collapsible-item") || s.matches("collapsible-list"))) {
              t = !0;
              break;
            }
          if (t) break;
        }
      t && await this._updateReverseHeading();
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
        const e = this.hasAttribute("reverse-heading") && this.getAttribute("reverse-heading") !== "false";
        this._observer && this._observer.disconnect();
        const t = async (n) => {
          for (const l of n) {
            e ? l.setAttribute("reverse-heading", "") : l.removeAttribute("reverse-heading");
            const r = l.querySelectorAll(":scope > collapsible-item");
            r.length > 0 && await t(Array.from(r));
            const d = l.querySelectorAll(":scope > collapsible-list");
            d.length > 0 && await i(Array.from(d));
          }
        }, i = async (n) => {
          for (const l of n) {
            if (l === this) continue;
            e ? l.setAttribute("reverse-heading", "") : l.removeAttribute("reverse-heading");
            const r = l.querySelectorAll(":scope > collapsible-item");
            r.length > 0 && await t(Array.from(r));
            const d = l.querySelectorAll(":scope > collapsible-list");
            d.length > 0 && await i(Array.from(d));
          }
        }, s = this.querySelectorAll(":scope > collapsible-item");
        s.length > 0 && await t(Array.from(s));
        const a = this.querySelectorAll(":scope > collapsible-list");
        a.length > 0 && await i(Array.from(a)), this.shadowRoot && this.shadowRoot.offsetHeight;
      } catch (e) {
        console.error("Error updating reverse heading:", e);
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
  _handleItemToggle(e) {
    if (this._isUpdating) return;
    const t = e.target;
    t.parentElement === this && (this._isUpdating = !0, this.hasAttribute("accordion") ? t.expanded && this._closeOtherItems(t) : this.hasAttribute("single-item") && t.expanded && this._closeOtherItems(t), this._isUpdating = !1);
  }
  _closeOtherItems(e) {
    if (this.closest("image-collection"))
      return;
    this.querySelectorAll("collapsible-item").forEach((i) => {
      i !== e && (i.expanded = !1);
    });
  }
  _getOpenItems() {
    return Array.from(this.querySelectorAll("collapsible-item[expanded]"));
  }
  _ensureOneItemExpanded() {
    if (!this.hasAttribute("accordion")) return;
    if (this._getOpenItems().length === 0) {
      const t = this.querySelector("collapsible-item");
      t && t.setAttribute("expanded", "");
    }
  }
}
customElements.get("collapsible-list") || customElements.define("collapsible-list", m);
class f extends HTMLElement {
  static get observedAttributes() {
    return ["icon", "label", "reverse"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._icon = "", this._label = "", this._reverse = !1, this._initialized = !1;
  }
  connectedCallback() {
    this._initialized || (this._initializeComponent(), this._initialized = !0), this._render();
  }
  _initializeComponent() {
    const e = document.createElement("style");
    e.textContent = `
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
    const t = document.createElement("span");
    t.className = "icon-label", t.setAttribute("part", "container");
    const i = document.createElement("slot");
    i.name = "icon", i.className = "icon-label__icon", i.setAttribute("part", "icon");
    const s = document.createElement("slot");
    s.className = "icon-label__label", s.setAttribute("part", "label"), t.appendChild(i), t.appendChild(s), this.shadowRoot.appendChild(e), this.shadowRoot.appendChild(t), this._container = t, this._iconSlot = i, this._labelSlot = s;
  }
  _render() {
    if (!this._initialized) return;
    if (this._container.className = "icon-label", this._reverse && this._container.classList.add("icon-label--reverse"), this._icon && this._iconSlot)
      if (this._iconSlot.innerHTML = "", this._icon.length === 1 || this._icon.length === 2 && this._icon.codePointAt(0) > 65535) {
        const i = document.createElement("span");
        i.className = "icon-label__char", i.textContent = this._icon, this._iconSlot.appendChild(i);
      } else {
        const i = document.createElement("img");
        i.src = this._icon, i.alt = "", this._iconSlot.appendChild(i);
      }
    const e = this._label || this.textContent.trim();
    if (e && this._labelSlot)
      if (this._labelSlot.textContent = "", !this._label && this.textContent.trim())
        for (; this.firstChild; )
          this._labelSlot.appendChild(this.firstChild);
      else
        this._labelSlot.textContent = e;
  }
  // Getters and setters for properties
  get icon() {
    return this._icon;
  }
  set icon(e) {
    this._icon = e, this.setAttribute("icon", e);
  }
  get label() {
    return this._label || this.textContent.trim();
  }
  set label(e) {
    this._label = e, this._labelSlot && (this._labelSlot.textContent = e);
  }
  get reverse() {
    return this._reverse;
  }
  set reverse(e) {
    this._reverse = e !== null && e !== !1, this._render();
  }
  // Handle attribute changes
  attributeChangedCallback(e, t, i) {
    if (t !== i)
      switch (e) {
        case "icon":
          this._icon = i || "";
          break;
        case "label":
          this._label = i || "", this._labelSlot && (this._labelSlot.textContent = this._label);
          break;
        case "reverse":
          this._reverse = i !== null, this._render();
          break;
      }
  }
}
customElements.get("icon-label") || customElements.define("icon-label", f);
class p extends HTMLLIElement {
  static get observedAttributes() {
    return ["expanded", "icon", "label", "removeshift", "hide-icon"];
  }
  constructor() {
    super(), this._isExpanded = !1, this._handleClick = this._handleClick.bind(this), this._header = null, this._content = null, this._initialRender = !0, this._removeShift = !1, this.rendered = !1, this.classList.add("collapsible-item"), this.hasAttribute("expanded") && (this._isExpanded = !0, this.classList.add("collapsible-item--expanded")), this.hasAttribute("removeshift") && this.classList.add("collapsible-item--no-padding");
  }
  connectedCallback() {
    this.hasAttribute("role") || this.setAttribute("role", "listitem"), this.rendered || (this._render(), this.rendered = !0, this._addEventListeners(), this._updateContentVisibility()), this.classList.add("collapsible-item"), this.hasAttribute("expanded") ? (this._isExpanded = !0, this.classList.add("collapsible-item--expanded")) : (this._isExpanded = !1, this.classList.remove("collapsible-item--expanded"));
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
  _handleClick(e) {
    if (!e.target.closest(".collapsible-item__header")) return;
    e.preventDefault(), e.stopPropagation();
    const i = !this.hasAttribute("expanded");
    i ? this.setAttribute("expanded", "") : this.removeAttribute("expanded"), this._isExpanded = i, this._updateContentVisibility(), this.dispatchEvent(new CustomEvent("toggle", {
      detail: { expanded: i },
      bubbles: !0,
      composed: !0
    }));
  }
  _createHeader() {
    const e = document.createElement("div");
    e.className = "collapsible-item__header";
    const t = document.createElement("div");
    t.style.display = "flex", t.style.alignItems = "center", t.style.flex = "1";
    const i = this.hasAttribute("hide-icon"), s = this.getAttribute("icon");
    if (s && !i) {
      const n = document.createElement("span");
      n.className = "collapsible-item__icon", n.textContent = s, n.style.marginRight = "0.5rem", t.appendChild(n);
    }
    const a = this.getAttribute("label") || "";
    if (a) {
      const n = document.createElement("span");
      n.className = "collapsible-item__label", n.textContent = a, t.appendChild(n);
    }
    return e.appendChild(t), e;
  }
  _render() {
    if (!this._isRendering) {
      this._isRendering = !0;
      const e = [];
      for (Array.from(this.children).forEach((t) => {
        t !== this._header && t !== this._content && e.push(t);
      }); this.firstChild; )
        this.removeChild(this.firstChild);
      this._header = this._createHeader(), this.appendChild(this._header), this._header && (this._header.setAttribute("role", "button"), this._header.setAttribute("aria-expanded", this._isExpanded ? "true" : "false"), this._header.setAttribute("tabindex", "0"), this._header.addEventListener("keydown", (t) => {
        (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this._toggleExpanded());
      })), this._content = this._createContent(), this._content && (this.appendChild(this._content), e.forEach((t) => {
        this._content.appendChild(t);
      })), this.setAttribute("role", "listitem"), this._updateContentVisibility(), this.rendered = !0, this._isRendering = !1;
    }
  }
  _createContent() {
    const e = document.createElement("div");
    e.className = "collapsible-item__content";
    const t = this.querySelectorAll(".collapsible-item__header, .collapsible-item__label, .collapsible-item__icon"), i = new Set(t);
    return Array.from(this.childNodes).filter((a) => a.nodeType === Node.ELEMENT_NODE ? !i.has(a) && !a.closest(".collapsible-item__header") : a.nodeType === Node.TEXT_NODE ? a.textContent.trim() !== "" && !a.textContent.includes("▶") && !a.textContent.includes("▼") : !1).forEach((a) => {
      e.appendChild(a.cloneNode(!0));
    }), e;
  }
  get expanded() {
    return this._isExpanded;
  }
  set expanded(e) {
    this._isExpanded !== e && (this._isExpanded = e, this._isExpanded ? this.setAttribute("expanded", "") : this.removeAttribute("expanded"), this._updateContentVisibility(), this.dispatchEvent(new CustomEvent("toggle", {
      detail: { expanded: this._isExpanded },
      bubbles: !0,
      composed: !0
    })));
  }
  _toggleExpanded() {
    this._isExpanded = !this._isExpanded, this._isExpanded ? this.setAttribute("expanded", "") : this.removeAttribute("expanded"), this._updateContentVisibility(), this.dispatchEvent(new CustomEvent("toggle", {
      detail: { expanded: this._isExpanded },
      bubbles: !0,
      composed: !0
    }));
  }
  _updateContentVisibility() {
    if (!this._content || !this._header) return;
    const e = this.hasAttribute("hide-icon");
    this._isExpanded ? (this._content.classList.add("collapsible-item__content--expanded"), this._content.style.display = "block", this._header.setAttribute("aria-expanded", "true"), this.classList.add("collapsible-item--expanded"), e || this.setAttribute("icon", "▼")) : (this._content.classList.remove("collapsible-item__content--expanded"), this._content.style.display = "none", this._header.setAttribute("aria-expanded", "false"), this.classList.remove("collapsible-item--expanded"), e || this.setAttribute("icon", "▶"));
  }
  attributeChangedCallback(e, t, i) {
    if (e === "removeshift")
      this._removeShift = i !== null, this._removeShift ? this.classList.add("collapsible-item--no-padding") : this.classList.remove("collapsible-item--no-padding");
    else if (e === "hide-icon" && this._header) {
      const s = this._header.querySelector(".collapsible-item__icon");
      if (i !== null)
        s && s.remove();
      else if (this.hasAttribute("icon") && !s) {
        const a = this.getAttribute("icon"), n = document.createElement("span");
        n.className = "collapsible-item__icon", n.textContent = a, n.style.marginRight = "0.5rem";
        const l = this._header.firstElementChild;
        l && l.insertBefore(n, l.firstChild);
      }
    } else if (e === "expanded") {
      const s = this._isExpanded;
      this._isExpanded = i !== null, this._isExpanded !== s && this._updateContentVisibility();
    } else if (e === "icon" && this._header) {
      let s = this._header.querySelector(".collapsible-item__icon");
      i ? (s || (s = document.createElement("span"), s.className = "collapsible-item__icon", this._header.insertBefore(s, this._header.firstChild)), s.textContent = i) : s && this._header.removeChild(s);
    } else if (e === "label" && this._header) {
      let s = this._header.querySelector(".collapsible-item__label");
      s ? s.textContent = i || "" : i && (s = document.createElement("span"), s.className = "collapsible-item__label", s.textContent = i, this._header.appendChild(s));
    }
  }
}
const c = "collapsible-item";
typeof window < "u" && window.customElements && (window.customElements.get(c) && (window.customElements.get(c), delete window.customElements._elements[c]), window.customElements.define(c, p, { extends: "li" }));
const C = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CollapsibleItem: p
}, Symbol.toStringTag, { value: "Module" }));
let h = {};
async function g() {
  try {
    const o = await import("./SelectionMenu-Dkc4cLuv.js");
    h.SelectionMenu = o.default || o;
  } catch (o) {
    console.warn("SelectionMenu component not found or failed to load", o);
  }
  try {
    const o = await import("./ProductLayout-CwMtYW6F.js");
    h.ProductLayout = o.default || o;
  } catch (o) {
    console.warn("ProductLayout component not found or failed to load", o);
  }
  return h;
}
function E() {
  return h;
}
const x = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CollapsibleItem: p,
  CollapsibleList: m,
  getAdditionalComponents: E,
  loadAdditionalComponents: g
}, Symbol.toStringTag, { value: "Module" }));
function _() {
  return Promise.all([
    customElements.whenDefined("collapsible-list"),
    customElements.whenDefined("collapsible-item"),
    customElements.whenDefined("icon-label"),
    customElements.whenDefined("selection-menu"),
    customElements.whenDefined("image-collection"),
    customElements.whenDefined("product-layout")
  ]);
}
typeof window < "u" && !window.__GENERIC_WEBCOMPONENTS_DEFINED__ && (window.__GENERIC_WEBCOMPONENTS_DEFINED__ = !0, _().catch(console.error));
const y = {
  install(o) {
    _().catch(console.error), Object.entries(x).forEach(([e, t]) => {
      if (typeof t == "function" && t.name) {
        const i = t.is || e.toLowerCase(), s = {
          name: e,
          inheritAttrs: !1,
          emits: [],
          // Will be populated with event names
          props: {},
          render() {
            const a = Object.entries(this.$attrs).reduce((l, [r, d]) => {
              const u = r.replace(/-([a-z])/g, (b) => b[1].toUpperCase());
              return l[u] = d, l;
            }, {}), n = {};
            return Object.keys(this.$listeners).forEach((l) => {
              n[l] = this.$listeners[l];
            }), this.$createElement(
              i,
              {
                attrs: a,
                on: n,
                ref: "webComponent"
              },
              this.$slots.default
            );
          }
        };
        o.component(e, s);
      }
    });
  }
};
export {
  C,
  y as V
};
//# sourceMappingURL=index-C0yFguPQ.js.map
