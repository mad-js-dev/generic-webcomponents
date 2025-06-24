import '../../components/organisms/selection-menu/SelectionMenu.js';

export default class SelectionMenuPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._menuData = [
      { id: '1', name: 'Item 1' },
      { 
        id: '2', 
        name: 'Item 2',
        children: [
          { id: '2.1', name: 'Subitem 2.1' },
          { id: '2.2', name: 'Subitem 2.2' }
        ]
      },
      { id: '3', name: 'Item 3' }
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'textContent') {
        element.textContent = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (value !== null && value !== undefined) {
        element.setAttribute(key, value);
      }
    });
    return element;
  }

  createTable(headers, rows) {
    const table = this.createElement('table', { className: 'props-table' });
    const thead = this.createElement('thead');
    const headerRow = this.createElement('tr');
    
    headers.forEach(header => {
      headerRow.appendChild(this.createElement('th', { textContent: header }));
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = this.createElement('tbody');
    rows.forEach(rowData => {
      const row = this.createElement('tr');
      rowData.forEach((cellData, i) => {
        const cell = this.createElement('td');
        if (i === 0) {
          cell.appendChild(this.createElement('code', { textContent: cellData }));
        } else {
          cell.textContent = cellData;
        }
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    return table;
  }

  setupEventListeners() {
    const menu = this.shadowRoot.querySelector('#demoMenu');
    const preview = this.shadowRoot.querySelector('#selectionPreview');
    const jsonPreview = this.shadowRoot.querySelector('#jsonPreview');
    
    if (menu) {
      menu.data = this._menuData;
      
      menu.addEventListener('item-selected', (e) => {
        preview.textContent = 'Selected: ' + e.detail.item.name + ' (ID: ' + e.detail.id + ')';
        jsonPreview.textContent = JSON.stringify(e.detail, null, 2);
      });
      
      const selectBtn = this.shadowRoot.querySelector('#selectBtn');
      if (selectBtn) {
        selectBtn.addEventListener('click', () => {
          menu.setSelectedItem('2.1');
        });
      }
    }
  }

  render() {
    // Clear shadow root
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }

    // Create styles
    const style = this.createElement('style');
    style.textContent = `
      .page-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      h1, h2, h3 { color: #2d3748; }
      .example {
        margin: 2rem 0;
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        background: #f8fafc;
      }
      pre {
        background: #2d3748;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 0.9em;
        margin: 1rem 0;
      }
      code {
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        background: #edf2f7;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-size: 0.9em;
      }
      .props-table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
      }
      .props-table th, .props-table td {
        border: 1px solid #e2e8f0;
        padding: 0.75rem;
        text-align: left;
      }
      .props-table th {
        background: #f7fafc;
        font-weight: 600;
      }
      .preview-container {
        display: flex;
        gap: 2rem;
        margin: 1.5rem 0;
      }
      .preview-panel { flex: 1; }
      .selection-preview, .json-preview {
        margin-top: 1rem;
        padding: 1rem;
        background: #edf2f7;
        border-radius: 4px;
        font-family: monospace;
        white-space: pre-wrap;
        min-height: 60px;
      }
      .json-preview {
        background: #2d3748;
        color: #e2e8f0;
        max-height: 300px;
        overflow-y: auto;
      }
      .btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: #4a6cf7;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        margin: 0.5rem 0.5rem 0.5rem 0;
        transition: background-color 0.2s;
      }
      .btn:hover { background: #3a5bd9; }
    `;

    // Create page container
    const pageContainer = this.createElement('div', { className: 'page-container' });
    
    // Add title and description
    pageContainer.appendChild(this.createElement('h1', { textContent: 'Selection Menu' }));
    pageContainer.appendChild(this.createElement('p', { 
      textContent: 'An interactive selection menu built with collapsible items that supports nested data and custom events.'
    }));

    // Add installation section
    pageContainer.appendChild(this.createElement('h2', { textContent: 'Installation' }));
    const preInstall = this.createElement('pre');
    preInstall.appendChild(this.createElement('code', { 
      textContent: '<script type="module" src="/path/to/SelectionMenu.js"></script>' 
    }));
    pageContainer.appendChild(preInstall);

    // Add demo section
    pageContainer.appendChild(this.createElement('h2', { textContent: 'Basic Usage' }));
    const exampleDiv = this.createElement('div', { className: 'example' });
    exampleDiv.appendChild(this.createElement('h3', { textContent: 'Interactive Demo' }));
    exampleDiv.appendChild(this.createElement('selection-menu', { id: 'demoMenu' }));
    
    // Preview container
    const previewContainer = this.createElement('div', { className: 'preview-container' });
    
    // Selection preview
    const previewPanel1 = this.createElement('div', { className: 'preview-panel' });
    previewPanel1.appendChild(this.createElement('h4', { textContent: 'Selection' }));
    previewPanel1.appendChild(this.createElement('div', { 
      id: 'selectionPreview',
      className: 'selection-preview',
      textContent: 'No item selected'
    }));
    previewPanel1.appendChild(this.createElement('button', {
      id: 'selectBtn',
      className: 'btn',
      textContent: 'Select Item 2.1 Programmatically'
    }));
    
    // JSON preview
    const previewPanel2 = this.createElement('div', { className: 'preview-panel' });
    previewPanel2.appendChild(this.createElement('h4', { textContent: 'Event Data' }));
    previewPanel2.appendChild(this.createElement('pre', {
      id: 'jsonPreview',
      className: 'json-preview',
      textContent: '{}'
    }));
    
    previewContainer.appendChild(previewPanel1);
    previewContainer.appendChild(previewPanel2);
    exampleDiv.appendChild(previewContainer);
    pageContainer.appendChild(exampleDiv);

    // Add features section
    const features = [
      'Supports nested data structures',
      'Custom events with full item data',
      'Programmatic selection',
      'Responsive design',
      'Keyboard navigation'
    ];
    
    pageContainer.appendChild(this.createElement('h2', { textContent: 'Features' }));
    const featuresList = this.createElement('ul');
    features.forEach(feature => {
      featuresList.appendChild(this.createElement('li', { textContent: feature }));
    });
    pageContainer.appendChild(featuresList);

    // Add API reference
    pageContainer.appendChild(this.createElement('h2', { textContent: 'API Reference' }));
    
    // Properties table
    pageContainer.appendChild(this.createElement('h3', { textContent: 'Properties' }));
    const properties = [
      ['data', 'Array | String', 'Menu items data (can be an array or JSON string)'],
      ['value', 'String', 'Currently selected item ID'],
      ['block-events-on-parent', 'Boolean', 'If true, prevents selection of items that have children']
    ];
    pageContainer.appendChild(this.createTable(['Name', 'Type', 'Description'], properties));
    
    // Methods table
    pageContainer.appendChild(this.createElement('h3', { textContent: 'Methods' }));
    const methods = [
      ['setSelectedItem(id)', 'Select an item by ID']
    ];
    pageContainer.appendChild(this.createTable(['Name', 'Description'], methods));
    
    // Events table
    pageContainer.appendChild(this.createElement('h3', { textContent: 'Events' }));
    const events = [
      ['item-selected', 'Triggered when an item is selected', '{ id: string, item: object }']
    ];
    pageContainer.appendChild(this.createTable(['Name', 'Description', 'Event Detail'], events));

    // Add examples
    pageContainer.appendChild(this.createElement('h2', { textContent: 'Examples' }));
    
    // Basic usage example
    pageContainer.appendChild(this.createElement('h3', { textContent: 'Basic Usage' }));
    const basicExample = this.createElement('pre');
    basicExample.appendChild(this.createElement('code', {
      textContent: '<selection-menu id="myMenu"></selection-menu>\n\n' +
        '<script>\n' +
        '  const menu = document.querySelector(\'#myMenu\');\n' +
        '  menu.data = [\n' +
        '    { id: \'1\', name: \'Item 1\' },\n' +
        '    { \n' +
        '      id: \'2\', \n' +
        '      name: \'Item 2\',\n' +
        '      children: [\n' +
        '        { id: \'2.1\', name: \'Subitem 2.1\' }\n' +
        '      ]\n' +
        '    }\n' +
        '  ];\n\n' +
        '  menu.addEventListener(\'item-selected\', (e) => {\n' +
        '    console.log(\'Selected:\', e.detail);\n' +
        '  });\n' +
        '</script>'
    }));
    pageContainer.appendChild(basicExample);
    
    // Programmatic selection example
    pageContainer.appendChild(this.createElement('h3', { textContent: 'Programmatic Selection' }));
    const progExample = this.createElement('pre');
    progExample.appendChild(this.createElement('code', {
      textContent: '// Select an item by ID\n' +
        'menu.setSelectedItem(\'2.1\');\n\n' +
        '// Clear selection\n' +
        'menu.setSelectedItem(null);\n\n' +
        '// Enable/disable parent item selection\n' +
        'menu.blockEventsOnParent = true; // Disable selection of parent items'
    }));
    pageContainer.appendChild(progExample);

    // Add everything to shadow root
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(pageContainer);
  }
}

// Import the component if not already loaded
if (!customElements.get('selection-menu')) {
  import('../../components/organisms/selection-menu/SelectionMenu.js');
}

customElements.define('selection-menu-page', SelectionMenuPage);
