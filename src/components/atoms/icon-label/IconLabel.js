/**
 * IconLabel Component
 * A custom element that displays an icon with a label
 */

export class IconLabel extends HTMLElement {
  static get observedAttributes() {
    return ['icon', 'label', 'reverse'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default values
    this._icon = '';
    this._label = '';
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
    // Create styles
    const style = document.createElement('style');
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


    // Create container
    const container = document.createElement('span');
    container.className = 'icon-label';
    container.setAttribute('part', 'container');

    // Create icon slot
    const iconSlot = document.createElement('slot');
    iconSlot.name = 'icon';
    iconSlot.className = 'icon-label__icon';
    iconSlot.setAttribute('part', 'icon');

    // Create label slot
    const labelSlot = document.createElement('slot');
    labelSlot.className = 'icon-label__label';
    labelSlot.setAttribute('part', 'label');

    // Append slots to container
    container.appendChild(iconSlot);
    container.appendChild(labelSlot);

    // Append elements to shadow root
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);

    // Store references
    this._container = container;
    this._iconSlot = iconSlot;
    this._labelSlot = labelSlot;
  }

  _render() {
    if (!this._initialized) return;

    // Update classes based on properties
    this._container.className = 'icon-label';
    if (this._reverse) {
      this._container.classList.add('icon-label--reverse');
    }

    // Update icon if provided
    if (this._icon && this._iconSlot) {
      this._iconSlot.innerHTML = '';
      
      // Check if the icon is a single character (likely an emoji or icon character)
      const isIconChar = this._icon.length === 1 || 
                       (this._icon.length === 2 && this._icon.codePointAt(0) > 0xFFFF);
      
      if (isIconChar) {
        // For single character icons (emojis, etc.)
        const charSpan = document.createElement('span');
        charSpan.className = 'icon-label__char';
        charSpan.textContent = this._icon;
        this._iconSlot.appendChild(charSpan);
      } else {
        // For image paths (URLs or data URIs)
        const img = document.createElement('img');
        img.src = this._icon;
        img.alt = ''; // Decorative image
        this._iconSlot.appendChild(img);
      }
    }

    // Set the label text
    const labelText = this._label || this.textContent.trim();
    if (labelText && this._labelSlot) {
      // Clear any existing content in the label slot
      this._labelSlot.textContent = '';
      
      // If there's no explicit label attribute but there is text content,
      // move the text content to the label slot
      if (!this._label && this.textContent.trim()) {
        while (this.firstChild) {
          this._labelSlot.appendChild(this.firstChild);
        }
      } else {
        // Otherwise, just set the text content
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
    this.setAttribute('icon', value);
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
      case 'icon':
        this._icon = newValue || '';
        break;
      case 'label':
        this._label = newValue || '';
        if (this._labelSlot) {
          this._labelSlot.textContent = this._label;
        }
        break;
      case 'reverse':
        this._reverse = newValue !== null;
        this._render();
        break;
    }
  }
}

// Define the custom element
if (!customElements.get('icon-label')) {
  customElements.define('icon-label', IconLabel);
}
