import { ProductLayout } from '../../components/templates/product-layout/ProductLayout.js';
// Import the local images data
import localImages from '../../../public/images/samples/images.js';

// Register the component if not already registered
if (!customElements.get('product-layout')) {
  customElements.define('product-layout', ProductLayout);
}

class ProductLayoutPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.images = [];
  }

  async connectedCallback() {
    await this.render();
    
    // Set images after the component is rendered
    requestAnimationFrame(() => {
      const productLayout = this.shadowRoot.getElementById('productLayout');
      if (productLayout) {
        const imagesScript = this.shadowRoot.querySelector('#productImages');
        if (imagesScript) {
          try {
            const images = JSON.parse(imagesScript.textContent);
            productLayout.images = images;
          } catch (e) {
            console.error('Failed to parse images:', e);
          }
        }
      }
    });
  }

  async render() {
    // Ensure images are loaded
    const images = Array.isArray(localImages) ? localImages : [];
    
    const demoHTML = `
      <div style="margin: 0 auto;">
        <product-layout id="productLayout" title="Product Gallery">
          <div class="vehicle-description">
            <p>This is a sample product layout with an image gallery. The gallery supports multiple images with smooth transitions.</p>
          </div>
          <script type="application/json" id="productImages">
            ${JSON.stringify(images)}
          </script>
        </product-layout>
      </div>
    `;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        h1 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }
        
        .description {
          margin-bottom: 2rem;
          line-height: 1.6;
          color: #4a5568;
        }
        
        .section {
          margin-bottom: 3rem;
        }
        
        .example {
          background: #fff;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .demo-container {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          background: #f8fafc;
        }
        
        .vehicle-description {
          margin-bottom: 1.5rem;
          line-height: 1.7;
          color: #4a5568;
        }
        
        .vehicle-specs {
          margin-top: 2rem;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }
        
        .vehicle-specs h3 {
          color: #2d3748;
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .vehicle-specs ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        
        .vehicle-specs li {
          padding: 0.75rem 1rem;
          background: white;
          border-radius: 6px;
          border-left: 3px solid #4a90e2;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .vehicle-specs li:hover {
          background: #f7fafc;
          transform: translateX(2px);
        }
        
        .vehicle-specs strong {
          color: #4a5568;
          margin-right: 0.5rem;
          font-weight: 500;
        }
        
        .demo-container {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 2rem;
          background: #f8fafc;
          margin: 1rem 0;
        }
        
        pre {
          background: #2d2d2d;
          color: #f8f8f2;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          margin: 1rem 0;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        
        code {
          font-family: 'Fira Code', 'Courier New', monospace;
        }
        
        .props-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        
        .props-table th, 
        .props-table td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1rem;
          text-align: left;
        }
        
        .props-table th {
          background: #f7fafc;
          font-weight: 600;
        }
        
        .props-table tr:nth-child(even) {
          background: #f8fafc;
        }
      </style>
      
      <div class="page">
        <h1>Product Layout</h1>
        <div class="description">
          <p>A flexible layout component that displays a product image gallery along with product details and content.</p>
        </div>
        
        <div class="section">
          <h2>Demo</h2>
          <div class="example">
            ${demoHTML}
          </div>
          
          <h3>HTML</h3>
          <pre><code>&lt;product-layout
  title="Product Name"
  images='[{"src": "path/to/image.jpg", "alt": "Product image"}]'&gt;
  &lt;p>Product description and details go here.&lt;/p&gt;
&lt;/product-layout&gt;</code></pre>
          
          <h3>JavaScript</h3>
          <pre><code>const product = document.querySelector('product-layout');
product.title = 'Amazing Product';
product.images = [
  { src: 'path/to/image1.jpg', alt: 'Product view 1' },
  { src: 'path/to/image2.jpg', alt: 'Product view 2' }
];</code></pre>
        </div>
      </div>
      
      <div class="section">
        <h2>Properties</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Description</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>title</code></td>
              <td>String</td>
              <td>The product title displayed at the top of the layout</td>
              <td>''</td>
            </tr>
            <tr>
              <td><code>images</code></td>
              <td>Array&lt;Object&gt;</td>
              <td>Array of image objects with <code>src</code> and <code>alt</code> properties</td>
              <td>[]</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Styling</h2>
        <p>Customize the appearance using CSS custom properties:</p>
        <pre><code>product-layout {
  --primary-color: #00f0ff;
  --text-color: #e0e0e0;
  --text-secondary: #8f9bb3;
  --border-color: #2a2a3a;
  --bg-color: #1a1a2e;
  --image-height: 400px;
}</code></pre>
      </div>
    `;
    
    // Initialize demo with sample data
    this.initializeDemo();
  }
  
  async initializeDemo() {
    try {
      // Wait for the component to be defined
      if (!customElements.get('product-layout')) {
        await customElements.whenDefined('product-layout');
      }
      
      const demo = this.shadowRoot.getElementById('productLayout');
      if (demo) {
        demo.title = 'Product Gallery';
        demo.images = [
          {
            src: 'https://example.com/cybertruck-1.jpg',
            alt: 'CyberTruck exterior',
            title: 'Exterior'
          },
          {
            src: 'https://example.com/cybertruck-2.jpg',
            alt: 'CyberTruck interior',
            title: 'Interior'
          },
          {
            src: 'https://example.com/cybertruck-3.jpg',
            alt: 'CyberTruck interior',
            title: 'Interior'
          }
        ];
        
        // Add some content
        const content = document.createElement('div');
        content.innerHTML = `
          <p>The CyberTruck is designed to have the utility of a truck with sports car performance. Built to be durable, versatile, and capable, with exceptional storage and performance.</p>
          
          <h3>Specifications</h3>
          <ul>
            <li>0-60 mph: as little as 2.9s</li>
            <li>Range: up to 500 miles</li>
            <li>Towing capacity: over 14,000 lbs</li>
            <li>Vault-like storage: 100 cubic feet</li>
          </ul>
        `;
        
        demo.appendChild(content);
      }
    } catch (error) {
      console.error('Error initializing demo:', error);
    }
  }
}

// Register the page component
if (!customElements.get('product-layout-page')) {
  customElements.define('product-layout-page', ProductLayoutPage);
}

export default ProductLayoutPage;
