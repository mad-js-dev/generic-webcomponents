export default class HomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .home-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        h1 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }
        
        p {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .components-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .component-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .component-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .component-card h3 {
          margin-top: 0;
          color: #2d3748;
        }
        
        .component-card a {
          color: #3182ce;
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          margin-top: 1rem;
        }
        
        .component-card a:hover {
          text-decoration: underline;
        }
      </style>
      
      <div class="home-container">
        <h1>Component Library</h1>
        <p>Welcome to the component documentation. Select a component to view its documentation and examples.</p>
        
        <div class="components-grid">
          <div class="component-card">
            <h3>Collapsible List</h3>
            <p>A flexible, accessible collapsible list component.</p>
            <a href="#/collapsible-list">View Documentation →</a>
          </div>
          
          <div class="component-card">
            <h3>Collapsible Item</h3>
            <p>Individual collapsible item component for use within lists.</p>
            <a href="#/collapsible-item">View Documentation →</a>
          </div>
          
          <div class="component-card">
            <h3>Selection Menu</h3>
            <p>Interactive selection menu with collapsible items.</p>
            <a href="#/selection-menu">View Documentation →</a>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('home-page', HomePage);
