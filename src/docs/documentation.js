export function createDocumentation() {
    return `
    <h1>Collapsible List Component</h1>
    <p>A flexible, accessible, and customizable collapsible list component built with Web Components.</p>
    
    <h2>Features</h2>
    <ul class="feature-list">
        <li>Fully keyboard accessible</li>
        <li>Supports nested lists</li>
        <li>Animated transitions</li>
        <li>Customizable styling</li>
        <li>Reverse heading layout option</li>
        <li>No external dependencies</li>
        <li>Small bundle size</li>
    </ul>
    
    <h2>Basic Usage</h2>
    <div class="example">
        <h3 class="example-title">Simple Collapsible List</h3>
        <div class="demo">
            <collapsible-list aria-label="Sample List">
                <collapsible-item>
                    <div slot="header">First Item</div>
                </collapsible-item>
                <collapsible-item>
                    <div slot="header">Second Item</div>
                </collapsible-item>
                <collapsible-item>
                    <div slot="header">Third Item</div>
                </collapsible-item>
            </collapsible-list>
        </div>
        
        <h4>Code:</h4>
        <pre><code>&lt;collapsible-list aria-label="Sample List"&gt;
    &lt;collapsible-item&gt;
        &lt;div slot="header"&gt;First Item&lt;/div&gt;
    &lt;/collapsible-item&gt;
    &lt;collapsible-item&gt;
        &lt;div slot="header"&gt;Second Item&lt;/div&gt;
    &lt;/collapsible-item&gt;
    &lt;collapsible-item&gt;
        &lt;div slot="header"&gt;Third Item&lt;/div&gt;
    &lt;/collapsible-item&gt;
&lt;/collapsible-list&gt;</code></pre>
    </div>
    
    <h2>Nested Lists</h2>
    <div class="example">
        <h3 class="example-title">Nested Collapsible Lists</h3>
        <div class="demo">
            <collapsible-list aria-label="Nested List Example">
                <collapsible-item>
                    <div slot="header">Parent Item 1</div>
                    <collapsible-list>
                        <collapsible-item>
                            <div slot="header">Child 1.1</div>
                        </collapsible-item>
                        <collapsible-item>
                            <div slot="header">Child 1.2</div>
                        </collapsible-item>
                    </collapsible-list>
                </collapsible-item>
                <collapsible-item>
                    <div slot="header">Parent Item 2</div>
                    <collapsible-list>
                        <collapsible-item>
                            <div slot="header">Child 2.1</div>
                        </collapsible-item>
                        <collapsible-item>
                            <div slot="header">Child 2.2</div>
                            <collapsible-list>
                                <collapsible-item>
                                    <div slot="header">Grandchild 2.2.1</div>
                                </collapsible-item>
                                <collapsible-item>
                                    <div slot="header">Grandchild 2.2.2</div>
                                </collapsible-item>
                            </collapsible-list>
                        </collapsible-item>
                        <collapsible-item>
                            <div slot="header">Child 2.3</div>
                        </collapsible-item>
                    </collapsible-list>
                </collapsible-item>
            </collapsible-list>
        </div>
    </div>
    
    <h2>Reverse Heading Layout</h2>
    <div class="example">
        <h3 class="example-title">With Reverse Heading</h3>
        <div class="controls">
            <button id="toggleReverse">Toggle Reverse Heading</button>
        </div>
        <div class="demo">
            <collapsible-list id="reverseDemo" aria-label="Reverse Heading Example">
                <collapsible-item>
                    <div slot="header">First Item</div>
                    <collapsible-list>
                        <collapsible-item>
                            <div slot="header">Nested 1.1</div>
                        </collapsible-item>
                        <collapsible-item>
                            <div slot="header">Nested 1.2</div>
                        </collapsible-item>
                    </collapsible-list>
                </collapsible-item>
                <collapsible-item>
                    <div slot="header">Second Item</div>
                </collapsible-item>
                <collapsible-item>
                    <div slot="header">Third Item</div>
                </collapsible-item>
            </collapsible-list>
        </div>
    </div>
    
    <h2>Pre-expanded Items</h2>
    <div class="example">
        <h3 class="example-title">Items Expanded by Default</h3>
        <div class="demo">
            <collapsible-list aria-label="Pre-expanded Example">
                <collapsible-item expanded>
                    <div slot="header">Expanded Item</div>
                    <collapsible-list>
                        <collapsible-item>
                            <div slot="header">Nested Item 1</div>
                        </collapsible-item>
                        <collapsible-item>
                            <div slot="header">Nested Item 2</div>
                        </collapsible-item>
                    </collapsible-list>
                </collapsible-item>
                <collapsible-item>
                    <div slot="header">Collapsed Item</div>
                </collapsible-item>
            </collapsible-list>
        </div>
    </div>
    
    <h2>Accessibility</h2>
    <p>The component implements proper ARIA attributes and keyboard navigation:</p>
    <ul>
        <li>Uses <code>role="list"</code> and <code>role="listitem"</code> for proper semantics</li>
        <li>Implements keyboard navigation with arrow keys, Home, and End</li>
        <li>Manages <code>aria-expanded</code> and <code>aria-controls</code> for screen readers</li>
        <li>Follows WAI-ARIA Authoring Practices for accordions and disclosures</li>
    </ul>
    
    <h2>Customization</h2>
    <p>You can customize the appearance using CSS custom properties:</p>
    <pre><code>collapsible-list {
    --indent-size: 1.5rem;  /* Controls the indentation of nested lists */
    --toggle-size: 24px;    /* Size of the toggle button */
    --toggle-margin: 0 8px 0 0;  /* Margin around the toggle button */
    --transition-duration: 0.2s;  /* Animation duration */
}

/* Custom styles for the header */
.collapsible-item__header {
    /* Your custom styles here */
}

/* Custom styles for the toggle button */
.collapsible-item__toggle {
    /* Your custom styles here */
}</code></pre>
    
    <h2>Browser Support</h2>
    <p>The component works in all modern browsers that support Web Components (Chrome, Firefox, Safari, Edge). For older browsers, you might need to include the Web Components polyfills.</p>
    
    <h2>Selection Menu Component</h2>
    <p>A customizable selection menu built on top of the collapsible list component, with support for nested items and selection states.</p>
    
    <div class="example">
        <h3 class="example-title">Interactive Selection Menu</h3>
        <div class="demo">
            <selection-menu id="demoMenu"></selection-menu>
            <div style="margin-top: 1rem;">
                <strong>Selected Item:</strong>
                <div id="selectedItemInfo" style="margin-top: 0.5rem; padding: 0.5rem; background: #f5f7fa; border-radius: 4px;">
                    No item selected
                </div>
            </div>
        </div>
        
        <h4>Code:</h4>
        <pre><code>&lt;!-- HTML -->
&lt;selection-menu id="myMenu"&gt;&lt;/selection-menu&gt;

&lt;script type="module"&gt;
  // Import the component
  import './components/selection-menu/SelectionMenu.js';
  
  // Get reference to the menu
  const menu = document.getElementById('myMenu');
  
  // Listen for selection changes
  menu.addEventListener('selection-change', (e) => {
    console.log('Selected:', e.detail);
    // e.detail contains { selectedId, selectedText }
  });
  
  // Programmatically select an item
  menu.setSelectedItem('2.2.1');
&lt;/script&gt;</code></pre>
    </div>
    
    <h3>Features</h3>
    <ul>
        <li>Supports multiple levels of nested items</li>
        <li>Keyboard navigation (arrow keys, Home, End)</li>
        <li>Customizable styling with CSS variables</li>
        <li>Events for selection changes</li>
        <li>Programmatic control</li>
    </ul>
    
    <h3>Styling</h3>
    <p>Customize the appearance using CSS variables:</p>
    <pre><code>selection-menu {
    --primary-color: #4a6cf7;    /* Selected item color */
    --hover-color: #f0f4ff;     /* Hover background color */
    --selected-color: #e6f0ff;  /* Selected item background */
    --border-color: #e1e4e8;    /* Border color */
    --border-radius: 6px;       /* Border radius */
    --item-padding: 8px 16px;   /* Item padding */
    --font-family: inherit;     /* Font family */
}</code></pre>
    `;
    
    // Add script for the demo
    document.addEventListener('DOMContentLoaded', () => {
        const menu = document.getElementById('demoMenu');
        const selectedItemInfo = document.getElementById('selectedItemInfo');
        
        if (menu && selectedItemInfo) {
            menu.addEventListener('selection-change', (e) => {
                const { selectedId, selectedText } = e.detail;
                selectedItemInfo.textContent = `ID: ${selectedId}\nText: ${selectedText}`;
            });
            
            // Select an item by default in the demo
            menu.setSelectedItem('2.2.1');
        }
    });
}
