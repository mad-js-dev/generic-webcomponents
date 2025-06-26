import '../../components/molecules/collapsible-list/CollapsibleList.js';
import '../../components/atoms/collapsible-item/CollapsibleItem.js';

export default class CollapsibleListPage extends HTMLElement {
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
    
    if (basicExample) {
      basicExample.addEventListener('toggle', (e) => {
        console.log('List item toggled:', e.detail.expanded);
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

        /* Custom styles for nested lists */
        collapsible-list {
          --indent-size: 1.5rem;
          margin: 0.5rem 0;
        }

        collapsible-item {
          margin: 0.25rem 0;
        }
      </style>
      
      <div class="page-container">
        <h1>Collapsible List</h1>
        <p>A flexible, accessible collapsible list component that manages a collection of collapsible items. Supports nested lists, keyboard navigation, and various display modes.</p>
        
        <h2>Basic Usage</h2>
        <p>A collapsible list with nested items, demonstrating the hierarchical structure:</p>
        
        <div class="example">
          <h3 class="example-title">Example</h3>
          <collapsible-list id="basic-example" aria-label="Documentation Menu">
            <collapsible-item expanded>
              <span slot="header">Getting Started</span>
              <collapsible-list>
                <collapsible-item>
                  <span slot="header">Installation</span>
                  <div style="padding: 0.5rem 0;">
                    <p>How to install the component library</p>
                  </div>
                </collapsible-item>
                <collapsible-item>
                  <span slot="header">Basic Usage</span>
                  <div style="padding: 0.5rem 0;">
                    <p>Basic implementation examples</p>
                  </div>
                </collapsible-item>
              </collapsible-list>
            </collapsible-item>
            <collapsible-item>
              <span slot="header">Components</span>
              <collapsible-list>
                <collapsible-item>
                  <span slot="header">CollapsibleList</span>
                  <div style="padding: 0.5rem 0;">
                    <p>Container for collapsible items</p>
                  </div>
                </collapsible-item>
                <collapsible-item>
                  <span slot="header">CollapsibleItem</span>
                  <div style="padding: 0.5rem 0;">
                    <p>Individual collapsible item component</p>
                  </div>
                </collapsible-item>
              </collapsible-list>
            </collapsible-item>
          </collapsible-list>
          
          <h4>Code:</h4>
          <pre><code>&lt;collapsible-list aria-label="Documentation Menu"&gt;
  &lt;collapsible-item expanded&gt;
    &lt;span slot="header"&gt;Getting Started&lt;/span&gt;
    &lt;collapsible-list&gt;
      &lt;collapsible-item&gt;
        &lt;span slot="header"&gt;Installation&lt;/span&gt;
        &lt;div&gt;How to install the component library&lt;/div&gt;
      &lt;/collapsible-item&gt;
      &lt;collapsible-item&gt;
        &lt;span slot="header"&gt;Basic Usage&lt;/span&gt;
        &lt;div&gt;Basic implementation examples&lt;/div&gt;
      &lt;/collapsible-item&gt;
    &lt;/collapsible-list&gt;
  &lt;/collapsible-item&gt;
  
  &lt;collapsible-item&gt;
    &lt;span slot="header"&gt;Components&lt;/span&gt;
    &lt;collapsible-list&gt;
      &lt;collapsible-item&gt;
        &lt;span slot="header"&gt;CollapsibleList&lt;/span&gt;
        &lt;div&gt;Container for collapsible items&lt;/div&gt;
      &lt;/collapsible-item&gt;
      &lt;collapsible-item&gt;
        &lt;span slot="header"&gt;CollapsibleItem&lt;/span&gt;
        &lt;div&gt;Individual collapsible item component&lt;/div&gt;
      &lt;/collapsible-item&gt;
    &lt;/collapsible-list&gt;
  &lt;/collapsible-item&gt;
&lt;/collapsible-list&gt;</code></pre>
        </div>

        <h2>Features</h2>
        
        <div class="example-grid">
          <div class="example-box">
            <div class="example-box-header">Nested Lists</div>
            <div class="example-box-content">
              <collapsible-list>
                <collapsible-item expanded>
                  <span slot="header">Parent Item</span>
                  <collapsible-list>
                    <collapsible-item>
                      <span slot="header">Child Item 1</span>
                      <div>Nested content</div>
                    </collapsible-item>
                    <collapsible-item>
                      <span slot="header">Child Item 2</span>
                      <div>More nested content</div>
                    </collapsible-item>
                  </collapsible-list>
                </collapsible-item>
              </collapsible-list>
              <pre><code>&lt;collapsible-list&gt;
  &lt;collapsible-item expanded&gt;
    &lt;span slot="header"&gt;Parent Item&lt;/span&gt;
    &lt;collapsible-list&gt;
      &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
      &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
    &lt;/collapsible-list&gt;
  &lt;/collapsible-item&gt;
&lt;/collapsible-list&gt;</code></pre>
            </div>
          </div>

          <div class="example-box">
            <div class="example-box-header">Accordion Mode</div>
            <div class="example-box-content">
              <collapsible-list accordion>
                <collapsible-item>
                  <span slot="header">Item 1</span>
                  <div>Only one item can be open at a time</div>
                </collapsible-item>
                <collapsible-item>
                  <span slot="header">Item 2</span>
                  <div>Clicking another item closes the previous one</div>
                </collapsible-item>
              </collapsible-list>
              <pre><code>&lt;collapsible-list accordion&gt;
  &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
  &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
&lt;/collapsible-list&gt;</code></pre>
            </div>
          </div>

          <div class="example-box">
            <div class="example-box-header">Reverse Heading</div>
            <div class="example-box-content">
              <collapsible-list reverse-heading>
                <collapsible-item>
                  <span slot="header">Toggle on right</span>
                  <div>Content with reverse heading layout</div>
                </collapsible-item>
                <collapsible-item>
                  <span slot="header">Another item</span>
                  <div>More content</div>
                </collapsible-item>
              </collapsible-list>
              <pre><code>&lt;collapsible-list reverse-heading&gt;
  &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
  &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
&lt;/collapsible-list&gt;</code></pre>
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
              <td><code>reverse-heading</code></td>
              <td>Boolean</td>
              <td><code>false</code></td>
              <td>Places the toggle on the right side of child items</td>
            </tr>
            <tr>
              <td><code>accordion</code></td>
              <td>Boolean</td>
              <td><code>false</code></td>
              <td>Only one item can be expanded at a time</td>
            </tr>
            <tr>
              <td><code>aria-label</code></td>
              <td>String</td>
              <td>-</td>
              <td>Accessibility label for the list (recommended)</td>
            </tr>
            <tr>
              <td><code>role</code></td>
              <td>String</td>
              <td><code>'list'</code></td>
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
              <th>Event.detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>toggle</code></td>
              <td>Fires when an item is expanded or collapsed</td>
              <td><code>{ expanded: boolean, item: HTMLElement }</code></td>
            </tr>
          </tbody>
        </table>

        <h2>Styling</h2>
        <p>Customize the appearance using CSS custom properties:</p>
        
        <pre><code>collapsible-list {
  --indent-size: 1.5rem;  /* Indentation for nested lists */
  --item-spacing: 0.25rem;  /* Spacing between items */
  --nested-indent: 0.5rem;  /* Additional indent for nested lists */
}</code></pre>

        <h2>Accessibility</h2>
        <p>The component includes built-in accessibility features:</p>
        <ul>
          <li>ARIA attributes for screen readers</li>
          <li>Keyboard navigation (Tab, Enter, Space, Arrow keys)</li>
          <li>Proper heading structure</li>
          <li>Focus management</li>
        </ul>

        <div class="highlight">
          <div class="highlight-title">Note</div>
          <p>Always provide an <code>aria-label</code> or <code>aria-labelledby</code> attribute for better accessibility, especially for nested lists.</p>
        </div>
      </div>
    `;
    
    // Import the component if not already loaded
    if (!customElements.get('collapsible-list')) {
      import('../../components/molecules/collapsible-list/CollapsibleList.js');
    }
    
    if (!customElements.get('collapsible-item')) {
      import('../../components/atoms/collapsible-item/CollapsibleItem.js');
    }
  }
}

customElements.define('collapsible-list-page', CollapsibleListPage);
