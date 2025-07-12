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

  get icon() {
    return this._icon;
  }

  set icon(value) {
    this._icon = value || '';
    this._render();
  }

  get label() {
    return this._label;
  }

  set label(value) {
    this._label = value || '';
    this._render();
  }

  get reverse() {
    return this._reverse;
  }

  set reverse(value) {
    this._reverse = value !== null && value !== 'false';
    this._render();
  }

  _render() {
    // Create container
    const container = document.createElement('span');
    container.style.display = 'inline-flex';
    container.style.alignItems = 'center';
    container.style.gap = '0.5rem';
    container.style.fontFamily = 'inherit';
    container.style.color = 'currentColor';
    
    if (this._reverse) {
      container.style.flexDirection = 'row-reverse';
    }

    // Create icon element if icon is provided
    if (this._icon) {
      const isImage = this._icon.startsWith('data:') || 
                     this._icon.startsWith('http') || 
                     this._icon.startsWith('/') ||
                     /\.(png|jpg|jpeg|svg|gif|webp)(\?.*)?$/i.test(this._icon);
      
      const icon = isImage ? document.createElement('img') : document.createElement('span');
      icon.style.display = 'inline-flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.style.width = '1em';
      icon.style.height = '1em';

      if (isImage) {
        icon.src = this._icon;
        icon.alt = '';
        icon.loading = 'lazy';
        icon.style.objectFit = 'contain';
      } else {
        icon.textContent = this._icon;
        icon.style.fontSize = '1em';
        icon.style.lineHeight = '1';
      }
      
      container.appendChild(icon);
    }

    // Add label if provided
    if (this._label) {
      const label = document.createElement('span');
      label.textContent = this._label;
      container.appendChild(label);
    }

    // Update the component
    this.innerHTML = '';
    this.appendChild(container);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    if (name === 'icon') {
      this._icon = newValue || '';
    } else if (name === 'label') {
      this._label = newValue || '';
    } else if (name === 'reverse') {
      this._reverse = newValue !== null && newValue !== 'false';
    }
    
    this._render();
  }
}

// Define the custom element
if (!customElements.get('icon-label')) {
  customElements.define('icon-label', IconLabel);
}
