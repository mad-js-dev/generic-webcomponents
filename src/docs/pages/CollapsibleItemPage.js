import '../../components/molecules/collapsible-item/CollapsibleItem.js';

export default class CollapsibleItemPage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Log toggle events for all collapsible items
    const items = this.querySelectorAll('li[is="collapsible-item"]');
    items.forEach((item, index) => {
      item.addEventListener('toggle', (e) => {
        console.log(`Item ${index + 1} toggled:`, e.detail.expanded);
      });
    });
  }

  render() {
    this.innerHTML = `
      <style>
        
        .page-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
        }
        
        h1, h2, h3 {
          color: #2d3748;
          margin: 2rem 0 1rem;
          font-weight: 600;
        }
        
        h1 { font-size: 2.25rem; }
        h2 { font-size: 1.75rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
        h3 { font-size: 1.5rem; }
        
        .example {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 2rem 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .example-title {
          margin: 0 0 1.5rem 0;
          color: #4a5568;
          font-weight: 500;
        }
        
        /* Style the collapsible items in examples */
        
        /* Reset list styles in examples */
        ul {
        padding: 0;
        }
        .example ul, 
        .example ol {
          padding: 0;
          margin: 0 0 0 1.5rem;
          list-style: none;
        }
        
        /* Ensure nested items have proper spacing */
                
        .example-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }
        
        .demo {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 1.5rem;
        }
        
        .code {
          background: #2d3748;
          color: #e2e8f0;
          border-radius: 6px;
          padding: 1.5rem;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.9em;
          line-height: 1.5;
          overflow-x: auto;
        }
        
        code {
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          background: #f1f5f9;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
          color: #2d3748;
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
        
      </style>
      
      <div class="page-container">
        <h1>Collapsible List Item</h1>
        <p>A lightweight, accessible collapsible list item component that extends the native <code>&lt;li&gt;</code> element.</p>
        
        <div class="example">
          <h2>Basic Usage</h2>
          <p>Create collapsible items by using the <code>is="collapsible-item"</code> attribute on <code>&lt;li&gt;</code> elements.</p>
          
          <div class="example-container">
            <div class="demo">
              <h3>Demo</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li is="collapsible-item" label="Documents" icon="📁">
                  <div>
                    <p>This is a document item with an icon.</p>
                    <p>Click the header to toggle content.</p>
                  </div>
                </li>
                <li is="collapsible-item" label="Pictures" icon="🖼️" expanded>
                  <div>
                    <p>This item is expanded by default.</p>
                    <ul style="list-style: none; padding-left: 1.5rem; margin: 0.5rem 0 0 0;">
                      <li>Vacation.jpg</li>
                      <li>Profile.png</li>
                      <li>Screenshot.png</li>
                    </ul>
                  </div>
                </li>
                <li is="collapsible-item" label="No Icon" removeshift>
                  <div>
                    <p>This item doesn't have an icon and has no left padding.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="code">
              <h3>Code</h3>
              <pre><code>&lt;ul style="list-style: none; padding: 0;"&gt;
  &lt;li is="collapsible-item" 
       label="Documents" 
       icon="📁"&gt;
    &lt;div &gt;
      &lt;p&gt;Content goes here&lt;/p&gt;
    &lt;/div&gt;
  &lt;/li&gt;
  
  &lt;li is="collapsible-item" 
       label="Pictures" 
       icon="🖼️" 
       expanded&gt;
    &lt;div &gt;
      &lt;p&gt;Expanded by default&lt;/p&gt;
      &lt;ul style="list-style: none; padding-left: 1.5rem;"&gt;
        &lt;li&gt;Vacation.jpg&lt;/li&gt;
        &lt;li&gt;Profile.png&lt;/li&gt;
      &lt;/ul&gt;
    &lt;/div&gt;
  &lt;/li&gt;
  
  &lt;li is="collapsible-item" 
       label="No Icon"
       removeshift&gt;
    &lt;div &gt;
      &lt;p&gt;No left padding variant&lt;/p&gt;
    &lt;/div&gt;
  &lt;/li&gt;
&lt;/ul&gt;</code></pre>
            </div>
          </div>
          
          <h3>Properties</h3>
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
                <td><code>label</code></td>
                <td>String</td>
                <td>''</td>
                <td>Text to display in the header</td>
              </tr>
              <tr>
                <td><code>icon</code></td>
                <td>String</td>
                <td>''</td>
                <td>Optional icon to display before the label</td>
              </tr>
              <tr>
                <td><code>expanded</code></td>
                <td>Boolean</td>
                <td><code>false</code></td>
                <td>Whether the item is expanded by default</td>
              </tr>
              <tr>
                <td><code>removeshift</code></td>
                <td>Boolean</td>
                <td><code>false</code></td>
                <td>If true, removes the left padding from the content area</td>
              </tr>
            </tbody>
          </table>
          
          <h3>Events</h3>
          <p>Dispatches a <code>toggle</code> event when the item is expanded or collapsed.</p>
          <pre><code>element.addEventListener('toggle', (e) => {
  console.log('Expanded:', e.detail.expanded);
});</code></pre>
        </div>
        
        <div class="example">
          <h2>Nested Example</h2>
          <p>You can nest collapsible items to create hierarchical structures.</p>
          
          <div class="example-container">
            <div class="demo">
              <h3>Demo</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li is="collapsible-item" label="Folder 1" icon="📁" expanded>
                  <ul style="list-style: none; margin: 0;">
                    <li is="collapsible-item" label="Subfolder A" icon="📂">
                      <p>Subfolder content</p>
                    </li>
                  </ul>
                </li>
                <li is="collapsible-item" label="Folder 2" icon="📁">
                  <p>Another folder</p>
                </li>
              </ul>
            </div>
            
            <div class="code">
              <h3>Code</h3>
              <pre><code>  &lt;ul style="list-style: none; padding: 0;"&gt;
    &lt;li is="collapsible-item" 
         label="Folder 1" 
         icon="📁" 
         expanded&gt;
      &lt;ul style="list-style: none; margin: 0;"&gt;
        &lt;li is="collapsible-item" 
             label="Subfolder A" 
             icon="📂"&gt;
          &lt;p&gt;Subfolder content&lt;/p&gt;
        &lt;/li&gt;
      &lt;/ul&gt;
    &lt;/li&gt;
    &lt;li is="collapsible-item" 
         label="Folder 2" 
         icon="📁"&gt;
      &lt;p&gt;Another folder&lt;/p&gt;
    &lt;/li&gt;
  &lt;/ul&gt;</code></pre>
      </div>
    </div>
  </div>
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
        <p>Customize the appearance using BEM (Block Element Modifier) classes:</p>
        
        <pre><code>/* Block: Main component */
</code></pre>

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
      import('../../components/molecules/collapsible-item/CollapsibleItem.js');
    }
  }
}

customElements.define('collapsible-item-page', CollapsibleItemPage);
