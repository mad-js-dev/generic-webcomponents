import '../../components/atoms/collapsible-item/CollapsibleItem.js';

export default class CollapsibleItemPage extends HTMLElement {
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
        <h1>Collapsible Item</h1>
        <p>An individual collapsible item component that can be used within a CollapsibleList.</p>
        
        <h2>Installation</h2>
        <pre><code>&lt;script type="module" src="/path/to/CollapsibleItem.js"&gt;&lt;/script&gt;</code></pre>
        
        <h2>Usage</h2>
        <div class="example">
          <collapsible-item>
            <span slot="header">Click to expand</span>
            <div>This is the collapsible content</div>
          </collapsible-item>
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
              <td>expanded</td>
              <td>Boolean</td>
              <td>false</td>
              <td>Whether the item is expanded</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>Boolean</td>
              <td>false</td>
              <td>Whether the item is disabled</td>
            </tr>
            <tr>
              <td>reverse-heading</td>
              <td>Boolean</td>
              <td>false</td>
              <td>Reverses the heading direction (RTL support)</td>
            </tr>
          </tbody>
        </table>
        
        <h2>Slots</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>header</td>
              <td>Content to display in the header/toggle area</td>
            </tr>
            <tr>
              <td>(default)</td>
              <td>Content to display when expanded</td>
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
              <td>Fires when the item is expanded or collapsed</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    // Import the component if not already loaded
    if (!customElements.get('collapsible-item')) {
      import('../../components/atoms/collapsible-item/CollapsibleItem.js');
    }
  }
}

customElements.define('collapsible-item-page', CollapsibleItemPage);
