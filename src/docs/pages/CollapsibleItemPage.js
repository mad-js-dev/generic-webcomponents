import '../../components/atoms/collapsible-item/CollapsibleItem.js';

export default class CollapsibleItemPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupExamples();
  }

  setupExamples() {
    // Setup event listeners for the examples
    const basicExample = this.shadowRoot.getElementById('basic-example');
    const reverseExample = this.shadowRoot.getElementById('reverse-example');
    const noIconExample = this.shadowRoot.getElementById('no-icon-example');
    
    if (basicExample) {
      basicExample.addEventListener('toggle', (e) => {
        console.log('Basic example toggled:', e.detail.expanded);
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .page-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
        }
        
        h1, h2, h3, h4 {
          color: #2d3748;
          margin-top: 2rem;
          font-weight: 600;
        }

        h1 { font-size: 2.5rem; margin-bottom: 1.5rem; }
        h2 { font-size: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }
        
        p, li {
          line-height: 1.6;
          color: #4a5568;
        }
        
        .example {
          margin: 2rem 0;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
        }
        
        .example-title {
          margin: 0 0 1rem 0;
          color: #4a5568;
          font-weight: 500;
        }
        
        pre {
          background: #2d3748;
          color: #e2e8f0;
          padding: 1.25rem;
          border-radius: 6px;
          overflow-x: auto;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.9em;
          line-height: 1.5;
          margin: 1.5rem 0;
        }
        
        code {
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
        }
        
        .props-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.95em;
        }
        
        .props-table th, .props-table td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1rem;
          text-align: left;
          vertical-align: top;
        }
        
        .props-table th {
          background: #f7fafc;
          font-weight: 600;
        }

        .props-table code {
          background: transparent;
          color: #4a6cf7;
          padding: 0;
        }

        .example-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .example-box {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .example-box-header {
          background: #f7fafc;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 500;
        }

        .example-box-content {
          padding: 1.5rem;
        }

        .highlight {
          background: #fff5f5;
          border-left: 4px solid #f56565;
          padding: 1rem;
          margin: 1.5rem 0;
          border-radius: 0 4px 4px 0;
        }

        .highlight-title {
          margin: 0 0 0.5rem 0;
          color: #c53030;
          font-weight: 600;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      </style>
      
      <div class="page-container">
        <h1>Collapsible Item</h1>
        <p>A flexible and accessible collapsible item component that can be used independently or within a CollapsibleList. Supports keyboard navigation and is fully customizable.</p>
        
        <h2>Basic Usage</h2>
        <p>A simple collapsible item with default styling:</p>
        
        <div class="example">
          <h3 class="example-title">Example</h3>
          <collapsible-item id="basic-example">
            <span slot="header">Click to expand</span>
            <div style="padding: 1rem 0;">
              <p>This is the collapsible content. It can contain any HTML elements.</p>
              <p>Try clicking the header or using the keyboard (Tab to focus, Enter/Space to toggle).</p>
            </div>
          </collapsible-item>
          
          <h4>Code:</h4>
          <pre><code>&lt;collapsible-item&gt;
  &lt;span slot="header"&gt;Click to expand&lt;/span&gt;
  &lt;div&gt;
    &lt;p&gt;This is the collapsible content.&lt;/p&gt;
  &lt;/div&gt;
&lt;/collapsible-item&gt;</code></pre>
        </div>

        <h2>Features</h2>
        
        <div class="example-grid">
          <div class="example-box">
            <div class="example-box-header">Reverse Heading</div>
            <div class="example-box-content">
              <collapsible-item reverse-heading>
                <span slot="header">Toggle on right</span>
                <div style="padding: 0.5rem 0;">
                  Content with reverse heading layout
                </div>
              </collapsible-item>
              <pre><code>&lt;collapsible-item reverse-heading&gt;
  &lt;span slot="header"&gt;Toggle on right&lt;/span&gt;
  ...
&lt;/collapsible-item&gt;</code></pre>
            </div>
          </div>

          <div class="example-box">
            <div class="example-box-header">No Toggle Icon</div>
            <div class="example-box-content">
              <collapsible-item hide-icon>
                <span slot="header">No toggle icon</span>
                <div style="padding: 0.5rem 0;">
                  Content without toggle icon
                </div>
              </collapsible-item>
              <pre><code>&lt;collapsible-item hide-icon&gt;
  &lt;span slot="header"&gt;No toggle icon&lt;/span&gt;
  ...
&lt;/collapsible-item&gt;</code></pre>
            </div>
          </div>

          <div class="example-box">
            <div class="example-box-header">Initially Expanded</div>
            <div class="example-box-content">
              <collapsible-item expanded>
                <span slot="header">Expanded by default</span>
                <div style="padding: 0.5rem 0;">
                  This content is visible by default
                </div>
              </collapsible-item>
              <pre><code>&lt;collapsible-item expanded&gt;
  &lt;span slot="header"&gt;Expanded by default&lt;/span&gt;
  ...
&lt;/collapsible-item&gt;</code></pre>
            </div>
          </div>
        </div>
        
        <h2>Properties</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>expanded</code></td>
              <td>Boolean</td>
              <td><code>false</code></td>
              <td>Whether the item is expanded by default</td>
            </tr>
            <tr>
              <td><code>reverse-heading</code></td>
              <td>Boolean</td>
              <td><code>false</code></td>
              <td>Places the toggle on the right side of the header</td>
            </tr>
            <tr>
              <td><code>hide-icon</code></td>
              <td>Boolean</td>
              <td><code>false</code></td>
              <td>Hides the toggle icon (useful for custom toggles)</td>
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
              <td><code>header</code></td>
              <td>Content to display in the header area (required)</td>
            </tr>
            <tr>
              <td>(default)</td>
              <td>Content to display when expanded (can contain any HTML)</td>
            </tr>
          </tbody>
        </table>
        
        <h2>Methods</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
              <th>Returns</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>toggle()</code></td>
              <td>Toggles the expanded state</td>
              <td>void</td>
            </tr>
            <tr>
              <td><code>expand()</code></td>
              <td>Expands the item</td>
              <td>void</td>
            </tr>
            <tr>
              <td><code>collapse()</code></td>
              <td>Collapses the item</td>
              <td>void</td>
            </tr>
          </tbody>
        </table>
        
        <h2>Events</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Description</th>
              <th>Event.detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>toggle</code></td>
              <td>Fires when the item is expanded or collapsed</td>
              <td><code>{ expanded: boolean }</code></td>
            </tr>
          </tbody>
        </table>

        <h2>Styling</h2>
        <p>Customize the appearance using CSS custom properties:</p>
        
        <pre><code>collapsible-item {
  --toggle-size: 24px;
  --toggle-margin: 0 8px 0 0;
  --toggle-padding: 8px;
  --toggle-color: currentColor;
  --content-padding: 8px 0 8px 32px;
}</code></pre>

        <h2>Accessibility</h2>
        <p>The component includes built-in accessibility features:</p>
        <ul>
          <li>ARIA attributes for screen readers</li>
          <li>Keyboard navigation (Tab, Enter, Space)</li>
          <li>Focus management</li>
          <li>Proper heading structure</li>
        </ul>

        <div class="highlight">
          <div class="highlight-title">Note</div>
          <p>For proper accessibility, always provide meaningful content in the header slot and ensure the collapsed content is properly related to its header.</p>
        </div>
      </div>
    `;
    
    // Import the component if not already loaded
    if (!customElements.get('collapsible-item')) {
      import('../../components/atoms/collapsible-item/CollapsibleItem.js');
    }
  }
}

customElements.define('collapsible-item-page', CollapsibleItemPage);
