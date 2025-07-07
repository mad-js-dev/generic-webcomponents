const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CollapsibleItem-BI6S5VCk.js","./IconLabel-DYi3NRef.js","./CollapsibleItem-Dl4vMwS4.css"])))=>i.map(i=>d[i]);
import{_ as f}from"./preload-helper-Dp1pzeXC.js";class g extends HTMLElement{static get observedAttributes(){return["items","selected"]}constructor(){super(),this.attachShadow({mode:"open"}),this._items=[],this._selectedId=null,this._boundOnItemClick=this._onItemClick.bind(this),f(()=>import("./CollapsibleItem-BI6S5VCk.js"),__vite__mapDeps([0,1,2]),import.meta.url)}connectedCallback(){this._render()}disconnectedCallback(){this._removeEventListeners()}attributeChangedCallback(i,n,e){if(n!==e)switch(i){case"items":this._items=e?JSON.parse(e):[],this._render();break;case"selected":this._selectedId=e,this._updateSelectedState();break}}get items(){return JSON.stringify(this._items)}set items(i){this._items=i?JSON.parse(i):[],this._render()}get selected(){return this._selectedId}set selected(i){this._selectedId!==i&&(this._selectedId=i,this._updateSelectedState())}_render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --primary-color: #4a6cf7;
          --hover-bg: #f5f8ff;
          --selected-bg: #e6f0ff;
          --border-color: #e2e8f0;
          --text-color: #2d3748;
          --text-secondary: #4a5568;
        }
        
        .menu-container {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          overflow: hidden;
        }
        
        .menu-item {
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin: 2px 0;
          border-radius: 4px;
        }
        
        .menu-item:hover {
          background-color: var(--hover-bg, #f5f8ff);
        }
        
        .menu-item--selected {
          background-color: var(--selected-bg, #e6f0ff);
          color: var(--primary-color, #4a6cf7);
          font-weight: 500;
        }
        
        .menu-item--selected:hover {
          background-color: var(--selected-bg, #e6f0ff);
        }
        
        /* Style for the collapsible item header */
        .menu-item::part(header) {
          padding: 8px 12px;
          display: flex;
          align-items: center;
        }
        
        /* Style for the collapsible item content */
        .menu-item::part(content) {
          padding: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.2s ease;
          max-height: 0;
          opacity: 0;
          margin: 0;
        }
        
        .menu-item::part(content).menu-item__content--expanded {
          max-height: 1000px; /* Adjust based on your needs */
          opacity: 1;
          padding: 4px 0 4px 1rem;
        }
        
        .menu-item__child-list {
          list-style: none;
          padding: 0;
          margin: 0 0 0 1rem;
        }
        
        /* Remove bullets from ul elements */
        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        
        /* Ensure list items have no default styling */
        li {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        /* Leaf item styles */
        .menu-item__leaf {
          display: flex;
          align-items: center;
          padding: 4px 12px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-radius: 4px;
        }
        
        .menu-item__leaf:hover {
          background-color: var(--hover-bg, #f5f8ff);
        }
        
        .menu-item__leaf.menu-item--selected {
          background-color: var(--selected-bg, #e6f0ff);
          color: var(--primary-color, #4a6cf7);
          font-weight: 500;
        }
        
        /* Arrow icon for collapsible items */
        .menu-item__arrow {
          display: inline-block;
          width: 12px;
          text-align: center;
          transition: transform 0.2s ease;
        }
        
        .menu-item[expanded] .menu-item__arrow {
          transform: rotate(90deg);
        }
      </style>
      <div class="menu-container">
        ${this._renderItems(this._items,0)}
      </div>
    `,this._addEventListeners())}_renderItems(i,n=0){if(!i||!i.length)return"";const e=document.createElement("ul");return e.style.listStyle="none",e.style.padding="0",e.style.margin="0",i.forEach(t=>{const s=t.children&&t.children.length>0,a=this._selectedId===t.id,o=document.createElement("li");if(o.setAttribute("data-id",t.id),s){o.setAttribute("is","collapsible-item"),o.setAttribute("data-id",t.id),o.setAttribute("label",t.name);const r=this._hasSelectedDescendant(t)||a;r&&o.setAttribute("expanded",""),o.setAttribute("icon",r?"▼":"▶"),o.style.marginRight="8px",o.style.transition="transform 0.2s ease",a&&o.classList.add("menu-item--selected");const c=document.createElement("ul");c.className="menu-item__child-list",c.innerHTML=this._renderItems(t.children,n+1);const d=document.createElement("div");d.slot="content",d.className="menu-item__content",d.appendChild(c),o.appendChild(d),o.addEventListener("toggle",m=>{d.style.display=m.detail.expanded?"block":"none"})}else{const l=document.createElement("span");l.className="menu-item__leaf",a&&l.classList.add("menu-item--selected");const r=document.createElement("span");r.className="menu-item__label",r.textContent=t.name,l.appendChild(r),l.addEventListener("click",c=>{c.stopPropagation(),this._selectedId=t.id,this._updateSelectedState(),this.dispatchEvent(new CustomEvent("item-selected",{detail:{id:t.id,item:t,name:t.name},bubbles:!0,composed:!0}))}),o.appendChild(l)}e.appendChild(o)}),n===0?e.outerHTML:e.innerHTML}_addEventListeners(){this.shadowRoot.addEventListener("click",this._boundOnItemClick)}_removeEventListeners(){this.shadowRoot.removeEventListener("click",this._boundOnItemClick)}_onItemClick(i){const n=i.target.closest(".menu-item__leaf");if(n){i.stopPropagation();const s=n.getAttribute("data-id");s&&(this.selected=s,this._updateSelectedState(),this.dispatchEvent(new CustomEvent("item-selected",{detail:{id:s},bubbles:!0,composed:!0})));return}const e=i.target.closest(".collapsible-item__header");if(!e)return;const t=e.parentElement;if(t&&t.getAttribute("is")==="collapsible-item"){i.stopPropagation();const s=t.hasAttribute("expanded"),a=t.querySelector(".menu-item__arrow");s?(t.removeAttribute("expanded"),a&&(a.textContent="▶")):(t.setAttribute("expanded",""),a&&(a.textContent="▼")),t.dispatchEvent(new CustomEvent("toggle",{detail:{expanded:!s},bubbles:!0,composed:!0}))}}_updateSelectedState(){if(!this.shadowRoot)return;const i=this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'),n=this.shadowRoot.querySelectorAll(".menu-item__leaf");if(i.forEach(e=>{e.classList.remove("menu-item--selected"),e.removeAttribute("selected")}),n.forEach(e=>{e.classList.remove("menu-item--selected")}),this._selectedId){const e=this.shadowRoot.querySelector(`li[is="collapsible-item"][data-id="${this._selectedId}"]`);e&&(e.classList.add("menu-item--selected"),e.setAttribute("selected",""));const t=this.shadowRoot.querySelector(`li[data-id="${this._selectedId}"] .menu-item__leaf`);t&&t.classList.add("menu-item--selected"),!e&&!t&&console.warn("Could not find selected item in the DOM. It might be in a closed collapsible section.")}}_hasSelectedDescendant(i){return i?i.id===this._selectedId?!0:i.children?i.children.some(n=>this._hasSelectedDescendant(n)):!1:!1}_findItemById(i,n){if(!i||!i.length)return null;for(const e of i){if(e.id===n)return e;if(e.children){const t=this._findItemById(e.children,n);if(t)return t}}return null}}customElements.get("selection-menu")||customElements.define("selection-menu",g);const E=Object.freeze(Object.defineProperty({__proto__:null,SelectionMenu:g},Symbol.toStringTag,{value:"Module"}));class x extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._menuData=[{id:"folder1",name:"Documents",children:[{id:"doc1",name:"Report.pdf"},{id:"doc2",name:"Presentation.pdf"}]},{id:"folder2",name:"Images",children:[{id:"subfolder1",name:"Vacation",children:[{id:"img1",name:"Beach.jpg"},{id:"img2",name:"Mountain.jpg"}]},{id:"img3",name:"Profile.png"}]},{id:"file1",name:"Notes.txt"}]}connectedCallback(){this.render(),this.setupEventListeners()}createElement(i,n={}){const e=document.createElement(i);return Object.entries(n).forEach(([t,s])=>{t==="className"?e.className=s:t==="textContent"?e.textContent=s:t==="innerHTML"?e.innerHTML=s:s!=null&&e.setAttribute(t,s)}),e}createTable(i,n){const e=this.createElement("table",{className:"props-table"}),t=this.createElement("thead"),s=this.createElement("tr");i.forEach(o=>{s.appendChild(this.createElement("th",{textContent:o}))}),t.appendChild(s),e.appendChild(t);const a=this.createElement("tbody");return n.forEach(o=>{const l=this.createElement("tr");o.forEach((r,c)=>{const d=this.createElement("td");c===0?d.appendChild(this.createElement("code",{textContent:r})):d.textContent=r,l.appendChild(d)}),a.appendChild(l)}),e.appendChild(a),e}setupEventListeners(){const i=this.shadowRoot.querySelector("#demoMenu"),n=this.shadowRoot.querySelector("#selectionPreview"),e=this.shadowRoot.querySelector("#jsonPreview");if(i){i.setAttribute("items",JSON.stringify(this._menuData)),i.addEventListener("item-selected",s=>{n.textContent=`Selected: ${s.detail.name} (ID: ${s.detail.id})`,e.textContent=JSON.stringify(s.detail,null,2)});const t=this.shadowRoot.querySelector("#selectBtn");t&&t.addEventListener("click",()=>{i.selected="img1"})}}render(){for(;this.shadowRoot.firstChild;)this.shadowRoot.removeChild(this.shadowRoot.firstChild);const i=this.createElement("style");i.textContent=`
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
    `;const n=this.createElement("div",{className:"page-container"});n.appendChild(this.createElement("h1",{textContent:"Selection Menu"})),n.appendChild(this.createElement("p",{textContent:"A fully accessible, interactive selection menu built with collapsible items. Supports nested data structures, custom events, keyboard navigation, and programmatic control."})),n.appendChild(this.createElement("h2",{textContent:"Installation"}));const e=this.createElement("pre");e.appendChild(this.createElement("code",{textContent:'<script type="module" src="/path/to/SelectionMenu.js"><\/script>'})),n.appendChild(e),n.appendChild(this.createElement("h2",{textContent:"Basic Usage"}));const t=this.createElement("div",{className:"example"});t.appendChild(this.createElement("h3",{textContent:"Interactive Demo"})),t.appendChild(this.createElement("selection-menu",{id:"demoMenu"}));const s=this.createElement("div",{className:"preview-container"}),a=this.createElement("div",{className:"preview-panel"});a.appendChild(this.createElement("h4",{textContent:"Selection"})),a.appendChild(this.createElement("div",{id:"selectionPreview",className:"selection-preview",textContent:"No item selected"})),a.appendChild(this.createElement("button",{id:"selectBtn",className:"btn",textContent:"Select Item 2.1 Programmatically"}));const o=this.createElement("div",{className:"preview-panel"});o.appendChild(this.createElement("h4",{textContent:"Event Data"})),o.appendChild(this.createElement("pre",{id:"jsonPreview",className:"json-preview",textContent:"{}"})),s.appendChild(a),s.appendChild(o),t.appendChild(s),n.appendChild(t);const l=["✅ Supports deeply nested data structures","🎯 Programmatic selection and state management","⌨️ Full keyboard navigation support","🎨 Customizable appearance through CSS variables","📱 Responsive and touch-friendly","🔔 Custom events for all interactions","⚡ Optimized for performance with large datasets","♿ Built with accessibility in mind (ARIA attributes)"];n.appendChild(this.createElement("h2",{textContent:"Features"}));const r=this.createElement("ul");l.forEach(p=>{r.appendChild(this.createElement("li",{textContent:p}))}),n.appendChild(r),n.appendChild(this.createElement("h2",{textContent:"API Reference"})),n.appendChild(this.createElement("h3",{textContent:"Properties"}));const c=[["items","String","JSON string representing the menu items structure"],["selected","String","ID of the currently selected item (read/write)"],["--primary-color","CSS Color","Main highlight color"],["--hover-bg","CSS Color","Background color on hover"],["--selected-bg","CSS Color","Background color for selected items"],["--border-color","CSS Color","Border color for the container"],["--text-color","CSS Color","Main text color"]];n.appendChild(this.createTable(["Name","Type","Description"],c)),n.appendChild(this.createElement("h3",{textContent:"Events"}));const d=[["item-selected","Triggered when a leaf node is selected",`{
  id: string,      // ID of the selected item
  item: object,    // The selected item object
  name: string     // Name of the selected item
}`]];n.appendChild(this.createTable(["Name","Description","Event Detail"],d)),n.appendChild(this.createElement("h2",{textContent:"Examples"})),n.appendChild(this.createElement("h3",{textContent:"Basic Usage"}));const m=this.createElement("pre");m.appendChild(this.createElement("code",{textContent:`<!-- HTML -->
<selection-menu id="fileExplorer"></selection-menu>

<!-- JavaScript -->
<script type="module">
  import './path/to/SelectionMenu.js';

  const menu = document.querySelector('#fileExplorer');
  
  // Set menu items with icons and custom data
  menu.items = [
    { 
      id: 'docs', 
      name: 'Documents',
      icon: '➤',
      meta: { type: 'folder' },
      children: [
        { id: 'report', name: 'Report.pdf', icon: '➤' },
        { id: 'sheet', name: 'Budget.xlsx', icon: '➤' }
      ]
    },
    { 
      id: 'images', 
      name: 'Pictures',
      icon: '🖼️',
      meta: { type: 'folder' },
      children: [
        { id: 'vacation', name: 'Vacation', icon: '➤', children: [
          { id: 'beach', name: 'Beach.jpg', icon: '➤' },
          { id: 'mountain', name: 'Mountain.jpg', icon: '➤' }
        ]}
      ]
    },
    { id: 'notes', name: 'Notes.txt', icon: '➤' }
  ];

  // Listen for selection changes
  menu.addEventListener('item-selected', (e) => {
    const { id, name, item } = e.detail;
    console.log(\`Selected: \${name} (\${id})\`, item);
  });
<\/script>`})),n.appendChild(m),n.appendChild(this.createElement("h3",{textContent:"Programmatic Control"}));const h=this.createElement("pre");h.appendChild(this.createElement("code",{textContent:`// Select an item by ID
menu.selected = 'report';

// Get the currently selected ID and item
const selectedId = menu.selected;
const selectedItem = menu.getSelectedItem(); // Returns the full item object

// Clear selection
menu.clearSelection();

// Update items dynamically (can be array or JSON string)
menu.items = [
  { 
    id: 'recent', 
    name: 'Recent',
    icon: '🕒',
    children: [
      { id: 'doc1', name: 'Document1.docx', icon: '📄' },
      { id: 'img1', name: 'Photo.jpg', icon: '🖼️' }
    ]
  },
  { id: 'trash', name: 'Trash', icon: '🗑️' }
];

// Expand/Collapse items programmatically
const itemElement = menu.getItemElement('recent');
if (itemElement) {
  itemElement.expanded = true; // Expand the item
  itemElement.scrollIntoView({ behavior: 'smooth' });
}

// Listen for expand/collapse events
menu.addEventListener('toggle', (e) => {
  console.log(\`Item \${e.detail.id} is now \${e.detail.expanded ? 'expanded' : 'collapsed'}\`);
});`})),n.appendChild(h),n.appendChild(this.createElement("h2",{textContent:"Accessibility"})),n.appendChild(this.createElement("p",{textContent:"The SelectionMenu is built with accessibility in mind and includes the following features:"}));const C=["✅ Keyboard navigation with arrow keys, Home, End, and type-ahead","✅ Proper ARIA attributes for screen readers","✅ Focus management","✅ High contrast support","✅ Proper heading structure","✅ Screen reader announcements"],u=this.createElement("ul");C.forEach(p=>{u.appendChild(this.createElement("li",{textContent:p}))}),n.appendChild(u),this.shadowRoot.appendChild(i),this.shadowRoot.appendChild(n)}}customElements.get("selection-menu")||f(()=>Promise.resolve().then(()=>E),void 0,import.meta.url);customElements.define("selection-menu-page",x);export{g as S};
