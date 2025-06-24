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
      
      // Ensure collapsible components are loaded
      await Promise.all([
        customElements.whenDefined('collapsible-item'),
        customElements.whenDefined('collapsible-list')
      ]);
      
      // Update the collection with local images
      if (demoCollection) {
        demoCollection.images = this.images;
        
        // Force update to ensure the first item is expanded
        setTimeout(() => {
          const firstItem = demoCollection.shadowRoot?.querySelector('collapsible-item');
          if (firstItem) {
            firstItem.expanded = true;
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
        }
        
        pre {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        code {
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.9em;
        }
      </style>
    `;

    const demoHTML = `
      <image-collection id="demoCollection"></image-collection>
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
            <li><strong>title</strong> (String): Title of the image</li>
            <li><strong>description</strong> (String, optional): Description of the image</li>
            <li><strong>src</strong> (String): URL to the image (required)</li>
            <li><strong>alt</strong> (String): Alt text for accessibility</li>
          </ul>
        </li>
        <li><strong>lastOpenedIndex</strong> (Number, read-only): Index of the currently expanded item, or -1 if none</li>
      </ul>
      
      <h3>Methods</h3>
      <ul>
        <li><strong>refresh()</strong>: Re-renders the component with the current images</li>
        <li><strong>getOpenItemIndex()</strong>: Returns the index of the currently expanded item, or -1 if none</li>
        <li><strong>openItem(index)</strong>: Expands the item at the specified index and collapses all others</li>
      </ul>
      
      <h3>Events</h3>
      <ul>
        <li><strong>item-selected</strong>: Fired when an item is selected. The event detail contains:
          <ul>
            <li><strong>index</strong> (Number): The index of the selected item</li>
            <li><strong>item</strong> (HTMLElement): The selected collapsible-item element</li>
          </ul>
        </li>
      </ul>
    `;

    this.shadowRoot.innerHTML = `
      ${style}
      <div class="page">
        <h1>Image Collection</h1>
        
        <div class="description">
          A component that displays a collection of images in a collapsible list, with only one image expanded at a time.
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
    
    // Import the component if not already loaded
    if (!customElements.get('image-collection')) {
      import('../../components/organisms/image-collection/ImageCollection.js');
    }
  }
}

customElements.define('image-collection-page', ImageCollectionPage);
