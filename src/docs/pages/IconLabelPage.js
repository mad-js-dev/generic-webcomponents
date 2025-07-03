import '../../components/atoms/icon-label/IconLabel.js';

export default class IconLabelPage extends HTMLElement {
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
        :host {
          display: block;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
        }

        h1, h2, h3, h4 {
          color: #2c3e50;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        h1 { font-size: 2.5rem; }
        h2 { font-size: 2rem; border-bottom: 1px solid #eaecef; padding-bottom: 0.5rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }

        p {
          margin: 1rem 0;
        }

        pre {
          background-color: #f6f8fa;
          border-radius: 6px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        code {
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          background-color: rgba(27, 31, 35, 0.05);
          border-radius: 3px;
          padding: 0.2em 0.4em;
          font-size: 0.9em;
        }

        pre code {
          background: none;
          padding: 0;
          border-radius: 0;
        }

        .example {
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          padding: 1.5rem;
          margin: 2rem 0;
          background: white;
        }

        .example-title {
          margin-top: 0;
          color: #24292e;
        }

        .demo {
          padding: 1.5rem;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          margin: 1rem 0;
          background: #f6f8fa;
        }

        .props-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .props-table th, .props-table td {
          border: 1px solid #dfe2e5;
          padding: 0.75rem 1rem;
          text-align: left;
        }

        .props-table th {
          background-color: #f6f8fa;
          font-weight: 600;
        }

        .props-table tr:nth-child(even) {
          background-color: #f6f8fa;
        }

        .badge {
          display: inline-block;
          padding: 0.2em 0.6em;
          font-size: 0.75em;
          font-weight: 600;
          line-height: 1;
          color: white;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          border-radius: 3px;
          background-color: #6c757d;
        }

        .badge.required {
          background-color: #dc3545;
        }

        .badge.optional {
          background-color: #6c757d;
        }

        .badge.default {
          background-color: #6c757d;
        }

        .example-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }
      </style>

      <h1>Icon Label</h1>
      <p>An atom component that combines an icon (as an image) with a label in a flexible layout.</p>

      <h2>Features</h2>
      <ul>
        <li>Flexible icon (as image) and text combination</li>
        <li>Support for both left and right icon positions</li>
        <li>Fully accessible with proper ARIA attributes</li>
        <li>Lightweight and dependency-free</li>
        <li>Responsive design that matches text size</li>
      </ul>

      <h2>Installation</h2>
      <pre><code>npm install @your-package/icon-label</code></pre>

      <h2>Basic Usage</h2>
      <div class="example">
        <h3 class="example-title">Using Image Icons</h3>
        <p>Basic usage with an icon image:</p>
        
        <div class="demo">
          <icon-label icon="/icons/Shard_Icon_CP2077.webp" label="Cyberware Shard"></icon-label>
        </div>

        <h4>Code:</h4>
        <pre><code>&lt;icon-label 
  icon="/icons/Shard_Icon_CP2077.webp"
  label="Cyberware Shard"
&gt;&lt;/icon-label&gt;</code></pre>
        
        <p>Or using slots for more control:</p>
        <pre><code>&lt;icon-label&gt;
  &lt;img slot="icon" src="/icons/Shard_Icon_CP2077.webp" alt="Shard Icon"&gt;
  Cyberware Shard
&lt;/icon-label&gt;</code></pre>
        
        <h3 class="example-title">Using Single Character Icons</h3>
        <p>You can also use single Unicode characters or emojis as icons:</p>
        
        <div class="demo">
          <icon-label icon="⭐" label="Favorite"></icon-label>
          <icon-label icon="🔔" label="Notifications"></icon-label>
          <icon-label icon="📁" label="Documents"></icon-label>
        </div>
        
        <h4>Code:</h4>
        <pre><code>&lt;icon-label icon="⭐" label="Favorite"&gt;&lt;/icon-label&gt;
&lt;icon-label icon="🔔" label="Notifications"&gt;&lt;/icon-label&gt;
&lt;icon-label icon="📁" label="Documents"&gt;&lt;/icon-label&gt;</code></pre>
        
        <p>Or with slot content:</p>
        <pre><code>&lt;icon-label icon="📁"&gt;Documents&lt;/icon-label&gt;</code></pre>
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
            <td><code>icon</code></td>
            <td>String</td>
            <td>''</td>
            <td>
              Can be either:
              <ul>
                <li>A path to an image file (e.g., <code>/icons/icon.png</code>)</li>
                <li>A single Unicode character or emoji (e.g., <code>⭐</code>, <code>📁</code>)</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td>String</td>
            <td>''</td>
            <td>Text label (can also be set via text content)</td>
          </tr>
          <tr>
            <td><code>reverse</code></td>
            <td>Boolean</td>
            <td>false</td>
            <td>If true, places the icon after the text</td>
          </tr>
        </tbody>
      </table>

      <h2>Examples</h2>
      
      <div class="example">
        <h3 class="example-title">Icon with Different Sources</h3>
        <p>Using different types of image sources:</p>
        
        <div class="demo">
          <div class="example-grid">
            <div>
              <icon-label icon="/icons/Shard_Icon_CP2077.webp" label="Shard Icon"></icon-label>
            </div>
            <div>
              <icon-label icon="/icons/Shard_Icon_CP2077.webp" label="Shard (WebP)"></icon-label>
            </div>
            <div>
              <icon-label icon="https://example.com/Shard_Icon_CP2077.webp" label="Remote Shard"></icon-label>
            </div>
          </div>
        </div>

        <h4>Code:</h4>
        <pre><code>&lt;!-- Local WebP --&gt;
&lt;icon-label 
  icon="/icons/Shard_Icon_CP2077.webp"
  label="Shard Icon"
&gt;&lt;/icon-label&gt;

&lt;!-- Different Sizes --&gt;
&lt;icon-label 
  icon="/icons/Shard_Icon_CP2077.webp"
  label="Shard (WebP)"
  style="font-size: 1.5rem;"
&gt;&lt;/icon-label&gt;

&lt;!-- Remote image --&gt;
&lt;icon-label 
  icon="https://example.com/Shard_Icon_CP2077.webp"
  label="Remote Shard"
&gt;&lt;/icon-label&gt;</code></pre>
      </div>

      <div class="example">
        <h3 class="example-title">Reversed Layout</h3>
        <p>Icon after the text:</p>
        
        <div class="demo">
          <icon-label 
            icon="/assets/icons/arrow-right.png" 
            label="Next Page"
            reverse
          ></icon-label>
        </div>

        <h4>Code:</h4>
        <pre><code>&lt;icon-label 
  icon="/path/to/arrow-right.png"
  label="Next Page"
  reverse
&gt;&lt;/icon-label&gt;</code></pre>
      </div>

      <h2>Accessibility</h2>
      <p>The <code>icon-label</code> component is built with accessibility in mind:</p>
      <ul>
        <li>Uses semantic HTML elements</li>
        <li>Includes proper ARIA attributes</li>
        <li>Supports keyboard navigation</li>
        <li>Maintains proper contrast ratios</li>
      </ul>

      <h2>Browser Support</h2>
      <p>The component works in all modern browsers including:</p>
      <ul>
        <li>Chrome (latest)</li>
        <li>Firefox (latest)</li>
        <li>Safari (latest)</li>
        <li>Edge (latest)</li>
      </ul>
      <p>For older browsers, you may need to include appropriate polyfills.</p>
    `;
  }
}

customElements.define('icon-label-page', IconLabelPage);
