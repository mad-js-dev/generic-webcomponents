class i extends HTMLElement {
  static get observedAttributes() {
    return ["icon", "label", "reverse"];
  }
  constructor() {
    super(), this._icon = "", this._label = "", this._reverse = !1;
  }
  connectedCallback() {
    this._render();
  }
  get icon() {
    return this._icon;
  }
  set icon(e) {
    this._icon = e || "", this._render();
  }
  get label() {
    return this._label;
  }
  set label(e) {
    this._label = e || "", this._render();
  }
  get reverse() {
    return this._reverse;
  }
  set reverse(e) {
    this._reverse = e !== null && e !== "false", this._render();
  }
  _render() {
    const e = document.createElement("span");
    if (e.style.display = "inline-flex", e.style.alignItems = "center", e.style.gap = "0.5rem", e.style.fontFamily = "inherit", e.style.color = "currentColor", this._reverse && (e.style.flexDirection = "row-reverse"), this._icon) {
      const s = this._icon.startsWith("data:") || this._icon.startsWith("http") || this._icon.startsWith("/") || /\.(png|jpg|jpeg|svg|gif|webp)(\?.*)?$/i.test(this._icon), t = s ? document.createElement("img") : document.createElement("span");
      t.style.display = "inline-flex", t.style.alignItems = "center", t.style.justifyContent = "center", t.style.width = "1em", t.style.height = "1em", s ? (t.src = this._icon, t.alt = "", t.loading = "lazy", t.style.objectFit = "contain") : (t.textContent = this._icon, t.style.fontSize = "1em", t.style.lineHeight = "1"), e.appendChild(t);
    }
    if (this._label) {
      const s = document.createElement("span");
      s.textContent = this._label, e.appendChild(s);
    }
    this.innerHTML = "", this.appendChild(e);
  }
  attributeChangedCallback(e, s, t) {
    s !== t && (e === "icon" ? this._icon = t || "" : e === "label" ? this._label = t || "" : e === "reverse" && (this._reverse = t !== null && t !== "false"), this._render());
  }
}
customElements.get("icon-label") || customElements.define("icon-label", i);
export {
  i as IconLabel
};
//# sourceMappingURL=IconLabel.js.map
