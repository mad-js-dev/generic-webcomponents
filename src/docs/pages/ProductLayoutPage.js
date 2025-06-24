import '../../components/templates/product-layout/ProductLayout.js';
import sampleImages from '../../../public/images/samples/images.js';

export class ProductLayoutPage extends HTMLElement {
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
          height: 100%;
        }
        
        .demo-section {
          margin-bottom: 3rem;
        }
        
        h2 {
          color: #2d3748;
          margin-bottom: 1rem;
        }
        
        .code-block {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          padding: 1rem;
          font-family: monospace;
          white-space: pre;
          overflow-x: auto;
          margin: 1rem 0;
          font-size: 0.875rem;
        }
        
        .vehicle-details {
          padding: 0 1.5rem 1.5rem;
        }
        
        .vehicle-details h3 {
          margin: 0 0 0.75rem 0;
          color: #1a202c;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .vehicle-details p {
          color: #4a5568;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
        }
        
        .specs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }
        
        .spec-item {
          background: #f8fafc;
          padding: 0.75rem;
          border-radius: 0.375rem;
          text-align: center;
        }
        
        .spec-label {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        
        .spec-value {
          display: block;
          font-weight: 600;
          color: #1e293b;
          font-size: 1.125rem;
        }
        
        .content-header p {
          color: #4a5568;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
        }
      </style>
      
      <div class="demo-section">
        <h2>Vehicle Showcase</h2>
        ${(() => {
          const vehicleImages = sampleImages.map((img, i) => ({
            ...img,
            title: ['Racer', 'Kobold', 'Itsumade'][i] || img.title
          }));
          
          return `
            <product-layout 
              title="ARCH Nazaré"
              images='${JSON.stringify(vehicleImages)}'>
              <p>After Archer released the Hella, the company ran into trouble. The popular family car proved so reliable and affordable that it quickly saturated the market. To avoid self-cannibalization, Archer was forced to diversify its portfolio by expanding into the sports car sector. The fruit of their efforts finally emerged in 2041 with the Quartz. This two-seater with a durable engine was marked at an approachable price, but the subtle elegance and sturdiness of its design made it popular among more than just the urban middle class. The Quartz is, as it turns out, well suited to endure the harsh desert climate. As a result, it has become a mainstay vehicle for a large portion of the nomad population. Any cityfolk who have dared risk interstate ground transport can likely testify that the silhouette of a Quartz on the horizon spells fast-approaching trouble.</p>
            </product-layout>
          `;
        })()}
            
        <div class="code-block">
&lt;product-layout 
  title="ARCH Nazaré"
  images='${JSON.stringify([
    {
      "title": "Racer",
      "src": "/images/samples/nature.jpg",
      "alt": "Racer vehicle"
    },
    {
      "title": "Kobold",
      "src": "/images/samples/architecture.jpg",
      "alt": "Kobold vehicle"
    },
    {
      "title": "Itsumade",
      "src": "/images/samples/technology.jpg",
      "alt": "Itsumade vehicle"
    }
  ])}'&gt;
  &lt;p&gt;After Archer released the Hella, the company ran into trouble...&lt;/p&gt;
&lt;/product-layout&gt;
        </div>
      </div>
    `;
  }
}

// Define the custom element
if (!customElements.get('product-layout-page')) {
  customElements.define('product-layout-page', ProductLayoutPage);
}
