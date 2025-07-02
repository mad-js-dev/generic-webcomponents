import '../../components/organisms/image-collection/ImageCollection.js';
// Import the local images data
import localImages from '../../../public/images/samples/images.js';

export default class ImageCollectionPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.images = [];
  }

  async connectedCallback() {
    this.render();
    
    // Show loading state
    const demoCollection = this.shadowRoot.getElementById('demoCollection');
    if (demoCollection) {
      demoCollection.innerHTML = '<p>Loading images...</p>';
    }
    
    try {
      // Use the locally imported images
      this.images = localImages;
      
      // Ensure the component is defined
      await customElements.whenDefined('image-collection');
      
      // Update the collection with local images
      if (demoCollection) {
        demoCollection.images = this.images;
        
        // Expand the first item by default
        setTimeout(() => {
          const firstItem = demoCollection.shadowRoot?.querySelector('li[is="collapsible-item"]');
          if (firstItem) {
            firstItem.setAttribute('expanded', '');
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error loading images:', error);
      if (demoCollection) {
        demoCollection.innerHTML = '<p>Error loading images. Please try again later.</p>';
      }
    }
  }
  
  // Removed fetchImage method as we're now using local images

  render() {
    const style = `
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
        
        pre {
          background: #2d2d2d;
          color: #f8f8f2;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          margin: 1rem 0;
          border: 1px solid #444;
        }
        
        code {
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.9em;
        }
      </style>
    `;

    const demoHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
        <p>Click on an image title to expand it. The component automatically handles closing other items when a new one is opened.</p>
        <div class="demo-container">
          <image-collection id="demoCollection"></image-collection>
        </div>
      </div>
    `;

    const usageExample = `
      <!-- Basic Usage -->
      <image-collection id="myCollection"></image-collection>
      
      <script>
        // Set images programmatically
        document.getElementById('myCollection').images = [
          {
            title: 'Image Title',
            description: 'Optional description',
            url: 'path/to/image.jpg',
            alt: 'Image description for accessibility'
          },
          // Add more images as needed
        ];
      </script>
    `;

    const apiDocs = `
      <h3>Properties</h3>
      <ul>
        <li><strong>images</strong> (Array): Array of image objects with the following structure:
          <ul>
            <li><strong>title</strong> (String): Title of the image (displayed in the collapsible header)</li>
            <li><strong>description</strong> (String, optional): Description of the image (displayed in the expanded content area)</li>
            <li><strong>url</strong> (String): URL to the image (required)</li>
            <li><strong>alt</strong> (String, optional): Alt text for accessibility</li>
            <li><strong>width</strong> (Number, optional): Width of the image in pixels</li>
            <li><strong>height</strong> (Number, optional): Height of the image in pixels</li>
          </ul>
        </li>
        <li><strong>_currentOpenIndex</strong> (Number, private): Index of the currently expanded item, or 0 (first item) by default</li>
      </ul>
      
      <h3>Methods</h3>
      <ul>
        <li><strong>render()</strong>: Re-renders the component with the current images</li>
        <li><strong>connectedCallback()</strong>: Lifecycle method called when the element is added to the DOM</li>
        <li><strong>disconnectedCallback()</strong>: Lifecycle method called when the element is removed from the DOM</li>
        <li><strong>_handleToggle(event)</strong>: Internal method that handles the toggle events from collapsible items</li>
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
      
      <h3>Styling</h3>
      <p>The component uses the following CSS custom properties for styling:</p>
      <ul>
        <li><strong>--collapsible-bg</strong>: Background color of the collapsible items</li>
        <li><strong>--collapsible-hover-bg</strong>: Background color on hover</li>
        <li><strong>--border-color</strong>: Border color of the items</li>
        <li><strong>--transition-speed</strong>: Transition speed for expand/collapse animations</li>
      </ul>
    `;

    this.shadowRoot.innerHTML = `
      ${style}
      <div class="page">
        <h1>Image Collection</h1>
        
        <div class="description">
          A collapsible image gallery component that displays a collection of images with their titles and descriptions. 
          Only one image can be expanded at a time, and the component handles smooth transitions between expanded states.
        </div>
        
        <div class="section">
          <h2>Demo</h2>
          <div class="example">
            ${demoHTML}
          </div>
        </div>
        
        <div class="section">
          <h2>Usage</h2>
          <pre><code>${usageExample}</code></pre>
        </div>
        
        <div class="section">
          <h2>API Reference</h2>
          ${apiDocs}
        </div>
      </div>
    `;
    
    // Initialize the demo
    const demoCollection = this.shadowRoot.getElementById('demoCollection');
    if (demoCollection) {
      demoCollection.images = this.images;
    }
  }
}

customElements.define('image-collection-page', ImageCollectionPage);
