class IconLabel extends HTMLElement {
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
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[`_${name}`] = newValue;
      this._render();
    }
  }
  get icon() {
    return this.getAttribute("icon") || "";
  }
  set icon(value) {
    this.setAttribute("icon", value);
  }
  get label() {
    return this.getAttribute("label") || "";
  }
  set label(value) {
    this.setAttribute("label", value);
  }
  get reverse() {
    return this.hasAttribute("reverse");
  }
  set reverse(value) {
    if (value) {
      this.setAttribute("reverse", "");
    } else {
      this.removeAttribute("reverse");
    }
  }
  _render() {
    this.innerHTML = "";
    const container = document.createElement("span");
    container.className = "icon-label";
    if (this.reverse) {
      container.classList.add("reverse");
    }
    if (this.icon) {
      const icon = document.createElement("i");
      icon.className = `icon ${this.icon}`;
      container.appendChild(icon);
    }
    if (this.label) {
      const label = document.createElement("span");
      label.className = "label";
      label.textContent = this.label;
      container.appendChild(label);
    }
    const style = document.createElement("style");
    style.textContent = `
      .icon-label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      
      .icon-label.reverse {
        flex-direction: row-reverse;
      }
      
      .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Add your icon styles here */
      .icon.heart { color: red; }
      .icon.star { color: gold; }
      /* Add more icon styles as needed */
    `;
    this.appendChild(style);
    this.appendChild(container);
  }
}
if (!customElements.get("icon-label")) {
  customElements.define("icon-label", IconLabel);
}
export {
  IconLabel,
  IconLabel as default
};
//# sourceMappingURL=IconLabel.js.map
