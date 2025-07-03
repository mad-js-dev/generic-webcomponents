export default class DocsLayout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .sidebar {
          width: 250px;
          background: #f5f7fa;
          padding: 1.5rem;
          border-right: 1px solid #e1e4e8;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #2c3e50;
        }
        
        .nav-section {
          margin-bottom: 2rem;
        }
        
        .nav-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #6a737d;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          letter-spacing: 0.5px;
        }
        
        .nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .nav-item {
          position: relative;
          margin-bottom: 0.25rem;
        }
        
        .nav-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem 0.5rem 1rem;
          color: #2c3e50;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .nav-category {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          font-size: 0.7rem;
          font-weight: 600;
          border-radius: 12px;
          background: #e9ecef;
          color: #495057;
          margin-left: 0.5rem;
        }
        
        /* Category colors */
        .nav-category.atom { background: #d0ebff; color: #1971c2; }
        .nav-category.molecule { background: #d3f9d8; color: #2b8a3e; }
        .nav-category.organism { background: #ffec99; color: #e67700; }
        .nav-category.template { background: #e6ccff; color: #5f3dc4; }
        
        .nav-link:hover {
          background-color: #e1e4e8;
        }
        
        .nav-link.active {
          color: #1a73e8;
          font-weight: 500;
        }
        
        .main-content {
          flex: 1;
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }
      </style>
      
      <aside class="sidebar">
        <div class="logo">Components</div>
        
        <nav class="nav-section">
          <h3 class="nav-title">Components</h3>
          <ul class="nav-links">
            <li><a href="#/" class="nav-link" data-route="home">Home</a></li>
            <li class="nav-item">
              <a href="#/icon-label" class="nav-link" data-route="icon-label">
                Icon Label
                <span class="nav-category atom">Atom</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#/collapsible-item" class="nav-link" data-route="collapsible-item">
                Collapsible Item
                <span class="nav-category molecule">Molecule</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#/selection-menu" class="nav-link" data-route="selection-menu">
                Selection Menu
                <span class="nav-category organism">Organism</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#/image-collection" class="nav-link" data-route="image-collection">
                Image Collection
                <span class="nav-category organism">Organism</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#/product-layout" class="nav-link" data-route="product-layout">
                Product Layout
                <span class="nav-category template">Template</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main class="main-content">
        <slot></slot>
      </main>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link');
      if (!link) return;
      
      // Update active state
      this.shadowRoot.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  }
}

customElements.define('docs-layout', DocsLayout);
