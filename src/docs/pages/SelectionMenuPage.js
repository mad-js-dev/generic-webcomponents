import '../../components/organisms/selection-menu/SelectionMenu.js';

export default class SelectionMenuPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._menuData = [
      { 
        id: 'folder1', 
        name: 'Documents',
        children: [
          { id: 'doc1', name: 'Report.pdf'},
          { id: 'doc2', name: 'Presentation.pdf' }
        ]
      },
      { 
        id: 'folder2',
        name: 'Images',
        children: [
          { 
            id: 'subfolder1',
            name: 'Vacation',
            children: [
              { id: 'img1', name: 'Beach.jpg' },
              { id: 'img2', name: 'Mountain.jpg' }
            ]
          },
          { id: 'img3', name: 'Profile.png' }
        ]
      },
      { id: 'file1', name: 'Notes.txt' }
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
      // Set the items as a JSON string to demonstrate attribute usage
      menu.setAttribute('items', JSON.stringify(this._menuData));
      
      menu.addEventListener('item-selected', (e) => {
        preview.textContent = `Selected: ${e.detail.name} (ID: ${e.detail.id})`;
        jsonPreview.textContent = JSON.stringify(e.detail, null, 2);
      });
      
      const selectBtn = this.shadowRoot.querySelector('#selectBtn');
      if (selectBtn) {
        selectBtn.addEventListener('click', () => {
          menu.selected = 'img1'; // Select Beach.jpg
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
      textContent: 'A fully accessible, interactive selection menu built with collapsible items. Supports nested data structures, custom events, keyboard navigation, and programmatic control.'
    }));

    // Add installation section
    pageContainer.appendChild(this.createElement('h2', { textContent: 'Installation' }));
    const preInstall = this.createElement('pre');
    preInstall.appendChild(this.createElement('code', { 
      textContent: '<script type="module" src="../../components/organisms/selection-menu/SelectionMenu.js"></script>' 
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
      '✅ Supports deeply nested data structures',
      '🎯 Programmatic selection and state management',
      '⌨️ Full keyboard navigation support',
      '🎨 Customizable appearance through CSS variables',
      '📱 Responsive and touch-friendly',
      '🔔 Custom events for all interactions',
      '⚡ Optimized for performance with large datasets',
      '♿ Built with accessibility in mind (ARIA attributes)'
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
      ['items', 'String', 'JSON string representing the menu items structure'],
      ['selected', 'String', 'ID of the currently selected item (read/write)'],
      ['--primary-color', 'CSS Color', 'Main highlight color'],
      ['--hover-bg', 'CSS Color', 'Background color on hover'],
      ['--selected-bg', 'CSS Color', 'Background color for selected items'],
      ['--border-color', 'CSS Color', 'Border color for the container'],
      ['--text-color', 'CSS Color', 'Main text color']
    ];
    pageContainer.appendChild(this.createTable(['Name', 'Type', 'Description'], properties));
    
    // Events table
    pageContainer.appendChild(this.createElement('h3', { textContent: 'Events' }));
    const events = [
      ['item-selected', 'Triggered when a leaf node is selected', '{\n  id: string,      // ID of the selected item\n  item: object,    // The selected item object\n  name: string     // Name of the selected item\n}']
    ];
    pageContainer.appendChild(this.createTable(['Name', 'Description', 'Event Detail'], events));

    // Add examples section
    pageContainer.appendChild(this.createElement('h2', { textContent: 'Examples' }));
    
    // Basic usage example
    pageContainer.appendChild(this.createElement('h3', { textContent: 'Basic Usage' }));
    const basicExample = this.createElement('pre');
    basicExample.appendChild(this.createElement('code', {
      textContent: '<!-- HTML -->\n' +
        '<selection-menu id="fileExplorer"></selection-menu>\n\n' +
        '<!-- JavaScript -->\n' +
        '<script type="module">\n' +
        '  import \'./path/to/SelectionMenu.js\';\n\n' +
        '  const menu = document.querySelector(\'#fileExplorer\');\n  \n' +
        '  // Set menu items with icons and custom data\n' +
        '  menu.items = [\n' +
        '    { \n' +
        '      id: \'docs\', \n' +
        '      name: \'Documents\',\n' +
        '      icon: \'➤\',\n' +
        '      meta: { type: \'folder\' },\n' +
        '      children: [\n' +
        '        { id: \'report\', name: \'Report.pdf\', icon: \'➤\' },\n' +
        '        { id: \'sheet\', name: \'Budget.xlsx\', icon: \'➤\' }\n' +
        '      ]\n' +
        '    },\n' +
        '    { \n' +
        '      id: \'images\', \n' +
        '      name: \'Pictures\',\n' +
        '      icon: \'🖼️\',\n' +
        '      meta: { type: \'folder\' },\n' +
        '      children: [\n' +
        '        { id: \'vacation\', name: \'Vacation\', icon: \'➤\', children: [\n' +
        '          { id: \'beach\', name: \'Beach.jpg\', icon: \'➤\' },\n' +
        '          { id: \'mountain\', name: \'Mountain.jpg\', icon: \'➤\' }\n' +
        '        ]}\n' +
        '      ]\n' +
        '    },\n' +
        '    { id: \'notes\', name: \'Notes.txt\', icon: \'➤\' }\n' +
        '  ];\n\n' +
        '  // Listen for selection changes\n' +
        '  menu.addEventListener(\'item-selected\', (e) => {\n' +
        '    const { id, name, item } = e.detail;\n' +
        '    console.log(`Selected: ${name} (${id})`, item);\n' +
        '  });\n' +
        '</script>'
    }));
    pageContainer.appendChild(basicExample);
    
    // Programmatic control example
    pageContainer.appendChild(this.createElement('h3', { textContent: 'Programmatic Control' }));
    const progExample = this.createElement('pre');
    progExample.appendChild(this.createElement('code', {
      textContent: '// Select an item by ID\n' +
        'menu.selected = \'report\';\n\n' +
        '// Get the currently selected ID and item\n' +
        'const selectedId = menu.selected;\n' +
        'const selectedItem = menu.getSelectedItem(); // Returns the full item object\n\n' +
        '// Clear selection\n' +
        'menu.clearSelection();\n\n' +
        '// Update items dynamically (can be array or JSON string)\n' +
        'menu.items = [\n' +
        '  { \n' +
        '    id: \'recent\', \n' +
        '    name: \'Recent\',\n' +
        '    icon: \'🕒\',\n' +
        '    children: [\n' +
        '      { id: \'doc1\', name: \'Document1.docx\', icon: \'📄\' },\n' +
        '      { id: \'img1\', name: \'Photo.jpg\', icon: \'🖼️\' }\n' +
        '    ]\n' +
        '  },\n' +
        '  { id: \'trash\', name: \'Trash\', icon: \'🗑️\' }\n' +
        '];\n\n' +
        '// Expand/Collapse items programmatically\n' +
        'const itemElement = menu.getItemElement(\'recent\');\n' +
        'if (itemElement) {\n' +
        '  itemElement.expanded = true; // Expand the item\n' +
        '  itemElement.scrollIntoView({ behavior: \'smooth\' });\n' +
        '}\n\n' +
        '// Listen for expand/collapse events\n' +
        'menu.addEventListener(\'toggle\', (e) => {\n' +
        '  console.log(`Item ${e.detail.id} is now ${e.detail.expanded ? \'expanded\' : \'collapsed\'}`);\n' +
        '});'
    }));
    pageContainer.appendChild(progExample);
    
    // Add accessibility section
    pageContainer.appendChild(this.createElement('h2', { textContent: 'Accessibility' }));
    pageContainer.appendChild(this.createElement('p', {
      textContent: 'The SelectionMenu is built with accessibility in mind and includes the following features:'
    }));
    
    const a11yFeatures = [
      '✅ Keyboard navigation with arrow keys, Home, End, and type-ahead',
      '✅ Proper ARIA attributes for screen readers',
      '✅ Focus management',
      '✅ High contrast support',
      '✅ Proper heading structure',
      '✅ Screen reader announcements'
    ];
    
    const a11yList = this.createElement('ul');
    a11yFeatures.forEach(feature => {
      a11yList.appendChild(this.createElement('li', { textContent: feature }));
    });
    pageContainer.appendChild(a11yList);

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
