import{l as a}from"./images-CdnHcJ7d.js";import"./CollapsibleItem-BI6S5VCk.js";import"./IconLabel-DYi3NRef.js";const o=[{title:"Nature",src:"/images/samples/nature.jpg",alt:"Scenic nature landscape",description:"A beautiful landscape showcasing nature's beauty."},{title:"Architecture",src:"/images/samples/architecture.jpg",alt:"Modern architecture building",description:"Stunning modern architecture design."},{title:"Technology",src:"/images/samples/technology.jpg",alt:"Technology circuit board",description:"Close-up of an advanced circuit board."}];class s extends HTMLElement{static get observedAttributes(){return["title","images"]}constructor(){super(),this.attachShadow({mode:"open"}),this._title="Product Name",this._images=[],this._isConnected=!1,this._hasRendered=!1,this._isUpdating=!1,this._elements=null,this._render=this._render.bind(this)}connectedCallback(){this._isConnected=!0,this._render()}disconnectedCallback(){this._isConnected=!1}attributeChangedCallback(e,t,i){if(t!==i){if(e==="title")this._title=i||"Product Name",this._updateTitle();else if(e==="images")if(typeof i=="string")try{const r=JSON.parse(i);this.images=Array.isArray(r)?r:[]}catch(r){console.error("Invalid images JSON:",r),this.images=[]}else Array.isArray(i)?this.images=i:this.images=[]}}get title(){return this._title}set title(e){this._title!==e&&(this._title=e||"",this._updateTitle())}get images(){return this._images}set images(e){if(Array.isArray(e))this._images=e.length>0?e:[...o];else if(typeof e=="string")try{const t=JSON.parse(e);this._images=Array.isArray(t)?t:[...o]}catch(t){console.error("Invalid images JSON:",t),this._images=[...o]}else this._images=[...o];this._updateImages()}_updateTitle(){var e;(e=this._elements)!=null&&e.title&&(this._elements.title.textContent=this._title)}_updateImages(){var e;(e=this._elements)!=null&&e.imageCollection&&(this._elements.imageCollection.images=[...this._images],this._elements.imageCollectionContainer&&(this._elements.imageCollectionContainer.style.display="block"))}_render(){if(!(this._isUpdating||!this.shadowRoot)){this._isUpdating=!0;try{this._hasRendered||(this.shadowRoot.innerHTML=`
          <style>
            :host {
              display: block;
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
            
            .product-layout {
              display: grid;
              grid-template-columns: 1fr;
              gap: 2rem;
            }
            
            .product-header {
              text-align: center;
              margin-bottom: 2rem;
            }
            
            .product-title {
              font-size: 2.5rem;
              color: #2d3748;
              margin: 0 0 1rem;
            }
            
            .content {
              line-height: 1.6;
              color: #4a5568;
            }
            
            .image-collection-container {
              margin: 2rem 0;
            }
            
            /* Remove padding from collapsible items */
            image-collection::part(content) {
              padding: 0;
            }
            
            @media (min-width: 1024px) {
              .product-layout {
                grid-template-columns: 1fr 1fr;
                align-items: start;
              }
            }
          </style>
          <div class="product-layout">
            <div class="product-content">
              <div class="product-header">
                <h1 class="product-title" id="title"></h1>
              </div>
              <div class="content" id="content">
                <slot></slot>
              </div>
            </div>
            <div class="image-collection-container" id="imageCollectionContainer" style="display: none;">
              <image-collection id="imageCollection"></image-collection>
            </div>
          </div>
        `,this._elements={title:this.shadowRoot.getElementById("title"),content:this.shadowRoot.getElementById("content"),imageCollection:this.shadowRoot.getElementById("imageCollection"),imageCollectionContainer:this.shadowRoot.getElementById("imageCollectionContainer")},this._images.length===0&&(this._images=[...o]),this._hasRendered=!0),this._updateTitle(),this._updateImages()}finally{this._isUpdating=!1}}}}typeof window<"u"&&!customElements.get("product-layout")&&customElements.define("product-layout",s);customElements.get("product-layout")||customElements.define("product-layout",s);class d extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.images=[]}async connectedCallback(){await this.render(),requestAnimationFrame(()=>{const e=this.shadowRoot.getElementById("productLayout");if(e){const t=this.shadowRoot.querySelector("#productImages");if(t)try{const i=JSON.parse(t.textContent);e.images=i}catch(i){console.error("Failed to parse images:",i)}}})}async render(){const e=Array.isArray(a)?a:[],t=`
      <div style="margin: 0 auto;">
        <product-layout id="productLayout" title="Product Gallery">
          <div class="vehicle-description">
            <p>This is a sample product layout with an image gallery. The gallery supports multiple images with smooth transitions.</p>
          </div>
          <script type="application/json" id="productImages">
            ${JSON.stringify(e)}
          <\/script>
        </product-layout>
      </div>
    `;this.shadowRoot.innerHTML=`
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
            ${t}
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
    `,this.initializeDemo()}async initializeDemo(){try{customElements.get("product-layout")||await customElements.whenDefined("product-layout");const e=this.shadowRoot.getElementById("productLayout");if(e){e.title="Product Gallery",e.images=[{src:"https://example.com/cybertruck-1.jpg",alt:"CyberTruck exterior",title:"Exterior"},{src:"https://example.com/cybertruck-2.jpg",alt:"CyberTruck interior",title:"Interior"},{src:"https://example.com/cybertruck-3.jpg",alt:"CyberTruck interior",title:"Interior"}];const t=document.createElement("div");t.innerHTML=`
          <p>The CyberTruck is designed to have the utility of a truck with sports car performance. Built to be durable, versatile, and capable, with exceptional storage and performance.</p>
          
          <h3>Specifications</h3>
          <ul>
            <li>0-60 mph: as little as 2.9s</li>
            <li>Range: up to 500 miles</li>
            <li>Towing capacity: over 14,000 lbs</li>
            <li>Vault-like storage: 100 cubic feet</li>
          </ul>
        `,e.appendChild(t)}}catch(e){console.error("Error initializing demo:",e)}}}customElements.get("product-layout-page")||customElements.define("product-layout-page",d);export{s as P};
