import "../../atoms/icon-label/IconLabel.js";
/* empty css                                                              */
class r extends HTMLLIElement {
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
    const s = !this.hasAttribute("expanded");
    s ? this.setAttribute("expanded", "") : this.removeAttribute("expanded"), this._isExpanded = s, this._updateContentVisibility(), this.dispatchEvent(new CustomEvent("toggle", {
      detail: { expanded: s },
      bubbles: !0,
      composed: !0
    }));
  }
  _createHeader() {
    const e = document.createElement("div");
    e.className = "collapsible-item__header";
    const i = document.createElement("div");
    i.style.display = "flex", i.style.alignItems = "center", i.style.flex = "1";
    const s = this.hasAttribute("hide-icon"), t = this.getAttribute("icon");
    if (t && !s) {
      const l = document.createElement("span");
      l.className = "collapsible-item__icon", l.textContent = t, l.style.marginRight = "0.5rem", i.appendChild(l);
    }
    const n = this.getAttribute("label") || "";
    if (n) {
      const l = document.createElement("span");
      l.className = "collapsible-item__label", l.textContent = n, i.appendChild(l);
    }
    return e.appendChild(i), e;
  }
  _render() {
    if (!this._isRendering) {
      this._isRendering = !0;
      const e = [];
      for (Array.from(this.children).forEach((i) => {
        i !== this._header && i !== this._content && e.push(i);
      }); this.firstChild; )
        this.removeChild(this.firstChild);
      this._header = this._createHeader(), this.appendChild(this._header), this._header && (this._header.setAttribute("role", "button"), this._header.setAttribute("aria-expanded", this._isExpanded ? "true" : "false"), this._header.setAttribute("tabindex", "0"), this._header.addEventListener("keydown", (i) => {
        (i.key === "Enter" || i.key === " ") && (i.preventDefault(), this._toggleExpanded());
      })), this._content = this._createContent(), this._content && (this.appendChild(this._content), e.forEach((i) => {
        this._content.appendChild(i);
      })), this.setAttribute("role", "listitem"), this._updateContentVisibility(), this.rendered = !0, this._isRendering = !1;
    }
  }
  _createContent() {
    const e = document.createElement("div");
    e.className = "collapsible-item__content";
    const i = this.querySelectorAll(".collapsible-item__header, .collapsible-item__label, .collapsible-item__icon"), s = new Set(i);
    return Array.from(this.childNodes).filter((n) => n.nodeType === Node.ELEMENT_NODE ? !s.has(n) && !n.closest(".collapsible-item__header") : n.nodeType === Node.TEXT_NODE ? n.textContent.trim() !== "" && !n.textContent.includes("▶") && !n.textContent.includes("▼") : !1).forEach((n) => {
      e.appendChild(n.cloneNode(!0));
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
  attributeChangedCallback(e, i, s) {
    if (e === "removeshift")
      this._removeShift = s !== null, this._removeShift ? this.classList.add("collapsible-item--no-padding") : this.classList.remove("collapsible-item--no-padding");
    else if (e === "hide-icon" && this._header) {
      const t = this._header.querySelector(".collapsible-item__icon");
      if (s !== null)
        t && t.remove();
      else if (this.hasAttribute("icon") && !t) {
        const n = this.getAttribute("icon"), l = document.createElement("span");
        l.className = "collapsible-item__icon", l.textContent = n, l.style.marginRight = "0.5rem";
        const a = this._header.firstElementChild;
        a && a.insertBefore(l, a.firstChild);
      }
    } else if (e === "expanded") {
      const t = this._isExpanded;
      this._isExpanded = s !== null, this._isExpanded !== t && this._updateContentVisibility();
    } else if (e === "icon" && this._header) {
      let t = this._header.querySelector(".collapsible-item__icon");
      s ? (t || (t = document.createElement("span"), t.className = "collapsible-item__icon", this._header.insertBefore(t, this._header.firstChild)), t.textContent = s) : t && this._header.removeChild(t);
    } else if (e === "label" && this._header) {
      let t = this._header.querySelector(".collapsible-item__label");
      t ? t.textContent = s || "" : s && (t = document.createElement("span"), t.className = "collapsible-item__label", t.textContent = s, this._header.appendChild(t));
    }
  }
}
const d = "collapsible-item";
typeof window < "u" && window.customElements && (window.customElements.get(d) && (window.customElements.get(d), delete window.customElements._elements[d]), window.customElements.define(d, r, { extends: "li" }));
export {
  r as CollapsibleItem
};
//# sourceMappingURL=CollapsibleItem.js.map
