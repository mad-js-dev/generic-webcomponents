class DocsRouter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.routes = {};
    this.currentRoute = null;
  }

  connectedCallback() {
    this.render();
    this.setupRouter();
    window.addEventListener('popstate', this.handlePopState.bind(this));
    this.navigate(window.location.hash || '#/');
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <slot></slot>
    `;
  }

  setupRouter() {
    const slot = this.shadowRoot.querySelector('slot');
    const children = slot.assignedNodes({flatten: true});
    
    children.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE && child.hasAttribute('path')) {
        const path = child.getAttribute('path');
        this.routes[path] = child;
        child.style.display = 'none';
      }
    });
  }

  handlePopState() {
    this.navigate(window.location.hash);
  }

  navigate(hash) {
    const path = this.parseHash(hash);
    
    // Hide current route
    if (this.currentRoute) {
      this.currentRoute.style.display = 'none';
    }
    
    // Show new route or fallback to home
    const route = this.routes[path] || this.routes['/'];
    if (route) {
      route.style.display = 'block';
      this.currentRoute = route;
    }
    
    // Update URL without triggering navigation
    if (window.location.hash !== hash) {
      window.history.pushState({}, '', hash || '#');
    }
  }

  parseHash(hash) {
    return hash.replace(/^#\/?/, '/') || '/';
  }
}

customElements.define('docs-router', DocsRouter);
