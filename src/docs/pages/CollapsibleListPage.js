import '../../components/molecules/collapsible-list/CollapsibleList.js';
import '../../components/atoms/collapsible-item/CollapsibleItem.js';

export default class CollapsibleListPage extends HTMLElement {
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
        .page-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        h1, h2, h3 {
          color: #2d3748;
        }
        
        .example {
          margin: 2rem 0;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
        }
        
        pre {
          background: #2d3748;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 0.9em;
        }
        
        .props-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .props-table th, .props-table td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          text-align: left;
        }
        
        .props-table th {
          background: #f7fafc;
        }
      </style>
      
      <div class="page-container">
        <h1>Collapsible List</h1>
        <p>A flexible, accessible collapsible list component that can be nested and styled as needed.</p>
        
        <h2>Installation</h2>
        <pre><code>&lt;script type="module" src="/path/to/CollapsibleList.js"&gt;&lt;/script&gt;</code></pre>
        
        <h2>Usage</h2>
        <div class="example">
          <collapsible-list>
            <collapsible-item>
              <span slot="header">Item 1</span>
              <div>Content for item 1</div>
            </collapsible-item>
            <collapsible-item>
              <span slot="header">Item 2</span>
              <div>Content for item 2</div>
            </collapsible-item>
          </collapsible-list>
        </div>
        
        <h2>Properties</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>aria-label</td>
              <td>String</td>
              <td>''</td>
              <td>Accessibility label for the list</td>
            </tr>
            <tr>
              <td>role</td>
              <td>String</td>
              <td>'list'</td>
              <td>ARIA role for the list</td>
            </tr>
          </tbody>
        </table>
        
        <h2>Events</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>toggle</td>
              <td>Fires when an item is expanded or collapsed</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    // Import the component if not already loaded
    if (!customElements.get('collapsible-list')) {
      import('../../components/molecules/collapsible-list/CollapsibleList.js');
    }
  }
}

customElements.define('collapsible-list-page', CollapsibleListPage);
