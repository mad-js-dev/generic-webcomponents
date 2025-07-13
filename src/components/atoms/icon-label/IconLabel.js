/**
 * IconLabel Component
 * A simple component that displays an icon next to a label
 */

export class IconLabel extends HTMLElement {
  static get observedAttributes() {
    return ['icon', 'label', 'reverse'];
  }

  constructor() {
    super();
    this._icon = '';
    this._label = '';
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
    return this.getAttribute('icon') || '';
  }

  set icon(value) {
    this.setAttribute('icon', value);
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  set label(value) {
    this.setAttribute('label', value);
  }

  get reverse() {
    return this.hasAttribute('reverse');
  }

  set reverse(value) {
    if (value) {
      this.setAttribute('reverse', '');
    } else {
      this.removeAttribute('reverse');
    }
  }

  _render() {
    // Clear existing content
    this.innerHTML = '';

    // Create container
    const container = document.createElement('span');
    container.className = 'icon-label';
    if (this.reverse) {
      container.classList.add('reverse');
    }

    // Create icon element if icon is provided
    if (this.icon) {
      const icon = document.createElement('i');
      icon.className = `icon ${this.icon}`;
      container.appendChild(icon);
    }

    // Create label element if label is provided
    if (this.label) {
      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = this.label;
      container.appendChild(label);
    }

    // Apply styles
    const style = document.createElement('style');
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
    
    // Append everything to the component
    this.appendChild(style);
    this.appendChild(container);
  }
}

// Define the custom element
if (!customElements.get('icon-label')) {
  customElements.define('icon-label', IconLabel);
}

// Add default export for better module support
export default IconLabel;
