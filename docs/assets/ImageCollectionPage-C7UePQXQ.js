import{l as n}from"./images-CdnHcJ7d.js";import"./CollapsibleItem-BI6S5VCk.js";import"./IconLabel-DYi3NRef.js";class r extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}async connectedCallback(){await this.render(),requestAnimationFrame(()=>{const e=this.shadowRoot.getElementById("demoCollection");if(e){const i=Array.isArray(n)?n:[];e.images=i,requestAnimationFrame(()=>{var t;const o=(t=e.shadowRoot)==null?void 0:t.querySelector('li[is="collapsible-item"]');o&&o.setAttribute("expanded","")})}})}render(){const e=`
      <style>
        :host {
          display: block;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        h1 {
          color: #2d3748;
          font-size: 2.5rem;
          margin: 0 0 1rem;
        }
        
        .description {
          color: #4a5568;
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto 2.5rem;
        }
        
        .demo-section {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 2rem;
          margin-bottom: 2.5rem;
        }
        
        .demo-container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          background: #f8fafc;
        }
        
        .code-example {
          margin-top: 2rem;
        }
        
        pre {
          background: #2d3748;
          color: #f7fafc;
          padding: 1.25rem;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 1.5rem 0;
          border: 1px solid #4a5568;
        }
        
        code {
          font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
        }
        
        .highlight {
          color: #4299e1;
          font-weight: 500;
        }

        .section {
          margin: 2.5rem 0;
        }

        .section h2 {
          color: #2d3748;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .section h3 {
          color: #4a5568;
          font-size: 1.4rem;
          margin: 2rem 0 1rem;
        }

        .section ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .section li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
      </style>
    `,i=`
      <div class="page-header">
        <h1>Image Collection</h1>
        <p class="description">
          A responsive and interactive image collection component that allows users to expand and collapse individual images.
          Only one image can be expanded at a time for a clean and focused viewing experience.
        </p>
      </div>
      
      <div class="demo-section">
        <div class="demo-container">
          <h2>Interactive Demo</h2>
          <p>Click on any image title to expand it. Click again to collapse.</p>
          <image-collection id="demoCollection"></image-collection>
        </div>
      </div>
    `,o=`
      <!-- Basic Usage with attribute -->
      <image-collection 
        images='${JSON.stringify([{title:"Nature",src:"/images/nature.jpg",alt:"Nature landscape",description:"Beautiful natural scenery"},{title:"Architecture",src:"/images/architecture.jpg",alt:"Modern building"}]).replace(/'/g,"&apos;")}'>
      </image-collection>
    `,t=`
      <h3>Properties</h3>
      <ul>
        <li>
          <strong>images</strong> (Array): Array of image objects with the following structure:
          <pre><code>{
  title: string,      // Title displayed for the image
  src: string,        // Image source URL
  alt: string,        // Alt text for accessibility
  description?: string // Optional description shown when expanded
}</code></pre>
        </li>
      </ul>

      <h3>Methods</h3>
      <ul>
        <li><strong>addImage(image)</strong>: Add a new image to the collection</li>
        <li><strong>removeImage(index)</strong>: Remove an image by index</li>
        <li><strong>expandAll()</strong>: Expand all images (only one will remain expanded at a time)</li>
        <li><strong>collapseAll()</strong>: Collapse all images</li>
      </ul>

      <h3>Events</h3>
      <ul>
        <li><strong>toggle</strong>: Fired when an item's expanded state changes. The event detail contains:
          <ul>
            <li><strong>index</strong> (Number): The index of the toggled item</li>
            <li><strong>expanded</strong> (Boolean): Whether the item is now expanded</li>
            <li><strong>target</strong> (HTMLElement): The collapsible item element that was toggled</li>
          </ul>
        </li>
      </ul>
      
      <h3>CSS Custom Properties</h3>
      <p>Customize the appearance using these CSS variables:</p>
      <ul>
        <li><strong>--primary-color</strong>: Main text and border color</li>
        <li><strong>--secondary-color</strong>: Secondary text color</li>
        <li><strong>--background-color</strong>: Background color of the component</li>
        <li><strong>--collapsible-bg</strong>: Background color of collapsible items</li>
        <li><strong>--collapsible-hover-bg</strong>: Background color on hover</li>
        <li><strong>--border-color</strong>: Border color of the items</li>
        <li><strong>--transition-speed</strong>: Transition speed for expand/collapse animations</li>
      </ul>
    `;this.shadowRoot.innerHTML=`
      ${e}
      ${i}
      
      <div class="section">
        <h2>Usage</h2>
        <p>Here's how to use the ImageCollection component in your project:</p>
        <pre><code class="language-html">${o}</code></pre>
      </div>
      
      <div class="section">
        <h2>API Reference</h2>
        ${t}
      </div>
    `;const a=this.shadowRoot.getElementById("demoCollection");a&&(a.images=this.images)}}customElements.define("image-collection-page",r);
