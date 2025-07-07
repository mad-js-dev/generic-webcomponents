const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CollapsibleItem-BI6S5VCk.js","./IconLabel-DYi3NRef.js","./CollapsibleItem-Dl4vMwS4.css"])))=>i.map(i=>d[i]);
import{_ as p}from"./preload-helper-Dp1pzeXC.js";import{CollapsibleItem as m}from"./CollapsibleItem-BI6S5VCk.js";import"./CollapsibleItemPage-BFC3BB3q.js";import{S as h}from"./SelectionMenuPage-DCOziaMt.js";import"./ImageCollectionPage-C7UePQXQ.js";import{P as g}from"./ProductLayoutPage-D2w-u8JV.js";import"./IconLabelPage-iNDycURv.js";import{I as b}from"./images-CdnHcJ7d.js";import{I as u}from"./IconLabel-DYi3NRef.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))l(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&l(n)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();class f extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render(),this.setupEventListeners()}render(){this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: flex;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .sidebar {
          width: 250px;
          background: #f5f7fa;
          padding: 1.5rem;
          border-right: 1px solid #e1e4e8;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #2c3e50;
        }
        
        .nav-section {
          margin-bottom: 2rem;
        }
        
        .nav-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #6a737d;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          letter-spacing: 0.5px;
        }
        
        .nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .nav-item {
          position: relative;
          margin-bottom: 0.25rem;
        }
        
        .nav-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem 0.5rem 1rem;
          color: #2c3e50;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .nav-category {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          font-size: 0.7rem;
          font-weight: 600;
          border-radius: 12px;
          background: #e9ecef;
          color: #495057;
          margin-left: 0.5rem;
        }
        
        /* Category colors */
        .nav-category.atom { background: #d0ebff; color: #1971c2; }
        .nav-category.molecule { background: #d3f9d8; color: #2b8a3e; }
        .nav-category.organism { background: #ffec99; color: #e67700; }
        .nav-category.template { background: #e6ccff; color: #5f3dc4; }
        
        .nav-link:hover {
          background-color: #e1e4e8;
        }
        
        .nav-link.active {
          color: #1a73e8;
          font-weight: 500;
        }
        
        .main-content {
          flex: 1;
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }
      </style>
      
      <aside class="sidebar">
        <div class="logo">Components</div>
        
        <nav class="nav-section">
          <h3 class="nav-title">Components</h3>
          <ul class="nav-links">
            <li><a href="#/" class="nav-link" data-route="home">Home</a></li>
            <li class="nav-item">
              <a href="#/icon-label" class="nav-link" data-route="icon-label">
                Icon Label
                <span class="nav-category atom">Atom</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#/collapsible-item" class="nav-link" data-route="collapsible-item">
                Collapsible Item
                <span class="nav-category molecule">Molecule</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#/selection-menu" class="nav-link" data-route="selection-menu">
                Selection Menu
                <span class="nav-category organism">Organism</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#/image-collection" class="nav-link" data-route="image-collection">
                Image Collection
                <span class="nav-category organism">Organism</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#/product-layout" class="nav-link" data-route="product-layout">
                Product Layout
                <span class="nav-category template">Template</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main class="main-content">
        <slot></slot>
      </main>
    `}setupEventListeners(){this.shadowRoot.addEventListener("click",t=>{const e=t.target.closest(".nav-link");e&&(this.shadowRoot.querySelectorAll(".nav-link").forEach(l=>l.classList.remove("active")),e.classList.add("active"))})}}customElements.define("docs-layout",f);class v extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.routes={},this.currentRoute=null}connectedCallback(){this.render(),this.setupRouter(),window.addEventListener("popstate",this.handlePopState.bind(this)),this.navigate(window.location.hash||"#/")}disconnectedCallback(){window.removeEventListener("popstate",this.handlePopState)}render(){this.shadowRoot.innerHTML=`
      <slot></slot>
    `}setupRouter(){this.shadowRoot.querySelector("slot").assignedNodes({flatten:!0}).forEach(l=>{if(l.nodeType===Node.ELEMENT_NODE&&l.hasAttribute("path")){const i=l.getAttribute("path");this.routes[i]=l,l.style.display="none"}})}handlePopState(){this.navigate(window.location.hash)}navigate(t){const e=this.parseHash(t);this.currentRoute&&(this.currentRoute.style.display="none");const l=this.routes[e]||this.routes["/"];l&&(l.style.display="block",this.currentRoute=l),window.location.hash!==t&&window.history.pushState({},"",t||"#")}parseHash(t){return t.replace(/^#\/?/,"/")||"/"}}customElements.define("docs-router",v);class y extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){this.shadowRoot.innerHTML=`
      <style>
        .home-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        h1 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }
        
        p {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .components-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .component-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .component-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .component-card h3 {
          margin-top: 0;
          color: #2d3748;
        }
        
        .component-card a {
          color: #3182ce;
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          margin-top: 1rem;
        }
        
        .component-card a:hover {
          text-decoration: underline;
        }
      </style>
      
      <div class="home-container">
        <h1>Component Library</h1>
        <p>Welcome to the component documentation. Select a component to view its documentation and examples.</p>
        
        <div class="components-grid">
          <div class="component-card">
            <h3>Collapsible List</h3>
            <p>A flexible, accessible collapsible list component.</p>
            <a href="#/collapsible-list">View Documentation →</a>
          </div>
          
          <div class="component-card">
            <h3>Collapsible Item</h3>
            <p>Individual collapsible item component for use within lists.</p>
            <a href="#/collapsible-item">View Documentation →</a>
          </div>
          
          <div class="component-card">
            <h3>Selection Menu</h3>
            <p>Interactive selection menu with collapsible items.</p>
            <a href="#/selection-menu">View Documentation →</a>
          </div>
          
          <div class="component-card">
            <h3>Image Collection</h3>
            <p>Responsive image gallery with lightbox functionality.</p>
            <a href="#/image-collection">View Documentation →</a>
          </div>
        </div>
      </div>
    `}}customElements.define("home-page",y);class d extends HTMLElement{static get observedAttributes(){return["reverse-heading","single-item","accordion"]}constructor(){super(),this.attachShadow({mode:"open"}),this._isUpdating=!1,this._handleItemToggle=this._handleItemToggle.bind(this);const t=document.createElement("div"),e=document.createElement("slot"),l=document.createElement("style");l.textContent=`
      :host {
        display: block;
        width: 100%;
        --indent-size: 1.5rem;
      }
      
      ::slotted(collapsible-item) {
        display: block;
        margin: 0.25rem 0;
        padding: 0;
        width: 100%;
      }
      
      /* Nested lists should have a border */
      ::slotted(collapsible-list) {
        border-left: 1px solid #e0e0e0;
        margin-left: 0.5rem;
        padding-left: 0.5rem;
      }
      
      /* Style for the header in collapsible items */
      .collapsible-item__header {
        display: flex;
        align-items: center;
        width: 100%;
        flex-direction: row;
      }
      
      /* Toggle container styles */
      .collapsible-item__toggle-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--toggle-size, 24px);
        height: var(--toggle-size, 24px);
        margin: var(--toggle-margin, 0 8px 0 0);
        flex-shrink: 0;
      }`,t.appendChild(e),this.shadowRoot.append(l,t)}async connectedCallback(){this._initialized||(this._initializeComponent(),this._initialized=!0,await this._updateReverseHeading(),this.addEventListener("toggle",this._handleItemToggle),this.hasAttribute("accordion")&&this._ensureOneItemExpanded()),this._setupMutationObserver()}_initializeComponent(){this.hasAttribute("role")||this.setAttribute("role","list"),!this.hasAttribute("aria-label")&&!this.hasAttribute("aria-labelledby")&&console.warn("collapsible-list: Add an aria-label or aria-labelledby attribute for accessibility")}_setupMutationObserver(){this._observer=new MutationObserver(async t=>{let e=!1;for(const l of t)if(l.type==="attributes"&&l.attributeName==="reverse-heading"){e=!0;break}else if(l.type==="childList"){for(const i of l.addedNodes)if(i.nodeType===Node.ELEMENT_NODE&&(i.matches("collapsible-item")||i.matches("collapsible-list"))){e=!0;break}if(e)break}e&&await this._updateReverseHeading()}),this._observer.observe(this,{attributes:!0,attributeFilter:["reverse-heading"],childList:!0,subtree:!0})}async _updateReverseHeading(){if(!this._isUpdating){this._isUpdating=!0;try{const t=this.hasAttribute("reverse-heading")&&this.getAttribute("reverse-heading")!=="false";this._observer&&this._observer.disconnect();const e=async n=>{for(const s of n){t?s.setAttribute("reverse-heading",""):s.removeAttribute("reverse-heading");const r=s.querySelectorAll(":scope > collapsible-item");r.length>0&&await e(Array.from(r));const c=s.querySelectorAll(":scope > collapsible-list");c.length>0&&await l(Array.from(c))}},l=async n=>{for(const s of n){if(s===this)continue;t?s.setAttribute("reverse-heading",""):s.removeAttribute("reverse-heading");const r=s.querySelectorAll(":scope > collapsible-item");r.length>0&&await e(Array.from(r));const c=s.querySelectorAll(":scope > collapsible-list");c.length>0&&await l(Array.from(c))}},i=this.querySelectorAll(":scope > collapsible-item");i.length>0&&await e(Array.from(i));const o=this.querySelectorAll(":scope > collapsible-list");o.length>0&&await l(Array.from(o)),this.shadowRoot&&this.shadowRoot.offsetHeight}catch(t){console.error("Error updating reverse heading:",t)}finally{this._observer&&this._observer.observe(this,{attributes:!0,attributeFilter:["reverse-heading"],childList:!0,subtree:!0}),this._isUpdating=!1}}}_handleItemToggle(t){if(this._isUpdating)return;const e=t.target;e.parentElement===this&&(this._isUpdating=!0,this.hasAttribute("accordion")?e.expanded&&this._closeOtherItems(e):this.hasAttribute("single-item")&&e.expanded&&this._closeOtherItems(e),this._isUpdating=!1)}_closeOtherItems(t){if(this.closest("image-collection"))return;this.querySelectorAll("collapsible-item").forEach(l=>{l!==t&&(l.expanded=!1)})}_getOpenItems(){return Array.from(this.querySelectorAll("collapsible-item[expanded]"))}_ensureOneItemExpanded(){if(!this.hasAttribute("accordion"))return;if(this._getOpenItems().length===0){const e=this.querySelector("collapsible-item");e&&e.setAttribute("expanded","")}}}customElements.get("collapsible-list")||customElements.define("collapsible-list",d);const x=Object.freeze(Object.defineProperty({__proto__:null,CollapsibleList:d},Symbol.toStringTag,{value:"Module"}));class w extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render(),this.setupExamples()}setupExamples(){const t=this.shadowRoot.getElementById("basic-example");t&&t.addEventListener("toggle",e=>{console.log("List item toggled:",e.detail.expanded)})}render(){this.shadowRoot.innerHTML=`
      <style>
        .page-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
        }
        
        h1, h2, h3, h4 {
          color: #2d3748;
          margin-top: 2rem;
          font-weight: 600;
        }

        h1 { font-size: 2.5rem; margin-bottom: 1.5rem; }
        h2 { font-size: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }
        
        p, li {
          line-height: 1.6;
          color: #4a5568;
        }
        
        .example {
          margin: 2rem 0;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
        }
        
        .example-title {
          margin: 0 0 1rem 0;
          color: #4a5568;
          font-weight: 500;
        }
        
        pre {
          background: #2d3748;
          color: #e2e8f0;
          padding: 1.25rem;
          border-radius: 6px;
          overflow-x: auto;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.9em;
          line-height: 1.5;
          margin: 1.5rem 0;
        }
        
        code {
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
        }
        
        .props-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.95em;
        }
        
        .props-table th, .props-table td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1rem;
          text-align: left;
          vertical-align: top;
        }
        
        .props-table th {
          background: #f7fafc;
          font-weight: 600;
        }

        .props-table code {
          background: transparent;
          color: #4a6cf7;
          padding: 0;
        }

        .example-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .example-box {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .example-box-header {
          background: #f7fafc;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 500;
        }

        .example-box-content {
          padding: 1.5rem;
        }

        .highlight {
          background: #fff5f5;
          border-left: 4px solid #f56565;
          padding: 1rem;
          margin: 1.5rem 0;
          border-radius: 0 4px 4px 0;
        }

        .highlight-title {
          margin: 0 0 0.5rem 0;
          color: #c53030;
          font-weight: 600;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Custom styles for nested lists */
        collapsible-list {
          --indent-size: 1.5rem;
          margin: 0.5rem 0;
        }

        collapsible-item {
          margin: 0.25rem 0;
        }
      </style>
      
      <div class="page-container">
        <h1>Collapsible List</h1>
        <p>A flexible, accessible collapsible list component that manages a collection of collapsible items. Supports nested lists, keyboard navigation, and various display modes.</p>
        
        <h2>Basic Usage</h2>
        <p>A collapsible list with nested items, demonstrating the hierarchical structure:</p>
        
        <div class="example">
          <h3 class="example-title">Example</h3>
          <collapsible-list id="basic-example" aria-label="Documentation Menu">
            <collapsible-item expanded>
              <span slot="header">Getting Started</span>
              <collapsible-list>
                <collapsible-item>
                  <span slot="header">Installation</span>
                  <div style="padding: 0.5rem 0;">
                    <p>How to install the component library</p>
                  </div>
                </collapsible-item>
                <collapsible-item>
                  <span slot="header">Basic Usage</span>
                  <div style="padding: 0.5rem 0;">
                    <p>Basic implementation examples</p>
                  </div>
                </collapsible-item>
              </collapsible-list>
            </collapsible-item>
            <collapsible-item>
              <span slot="header">Components</span>
              <collapsible-list>
                <collapsible-item>
                  <span slot="header">CollapsibleList</span>
                  <div style="padding: 0.5rem 0;">
                    <p>Container for collapsible items</p>
                  </div>
                </collapsible-item>
                <collapsible-item>
                  <span slot="header">CollapsibleItem</span>
                  <div style="padding: 0.5rem 0;">
                    <p>Individual collapsible item component</p>
                  </div>
                </collapsible-item>
              </collapsible-list>
            </collapsible-item>
          </collapsible-list>
          
          <h4>Code:</h4>
          <pre><code>&lt;collapsible-list aria-label="Documentation Menu"&gt;
  &lt;collapsible-item expanded&gt;
    &lt;span slot="header"&gt;Getting Started&lt;/span&gt;
    &lt;collapsible-list&gt;
      &lt;collapsible-item&gt;
        &lt;span slot="header"&gt;Installation&lt;/span&gt;
        &lt;div&gt;How to install the component library&lt;/div&gt;
      &lt;/collapsible-item&gt;
      &lt;collapsible-item&gt;
        &lt;span slot="header"&gt;Basic Usage&lt;/span&gt;
        &lt;div&gt;Basic implementation examples&lt;/div&gt;
      &lt;/collapsible-item&gt;
    &lt;/collapsible-list&gt;
  &lt;/collapsible-item&gt;
  
  &lt;collapsible-item&gt;
    &lt;span slot="header"&gt;Components&lt;/span&gt;
    &lt;collapsible-list&gt;
      &lt;collapsible-item&gt;
        &lt;span slot="header"&gt;CollapsibleList&lt;/span&gt;
        &lt;div&gt;Container for collapsible items&lt;/div&gt;
      &lt;/collapsible-item&gt;
      &lt;collapsible-item&gt;
        &lt;span slot="header"&gt;CollapsibleItem&lt;/span&gt;
        &lt;div&gt;Individual collapsible item component&lt;/div&gt;
      &lt;/collapsible-item&gt;
    &lt;/collapsible-list&gt;
  &lt;/collapsible-item&gt;
&lt;/collapsible-list&gt;</code></pre>
        </div>

        <h2>Features</h2>
        
        <div class="example-grid">
          <div class="example-box">
            <div class="example-box-header">Nested Lists</div>
            <div class="example-box-content">
              <collapsible-list>
                <collapsible-item expanded>
                  <span slot="header">Parent Item</span>
                  <collapsible-list>
                    <collapsible-item>
                      <span slot="header">Child Item 1</span>
                      <div>Nested content</div>
                    </collapsible-item>
                    <collapsible-item>
                      <span slot="header">Child Item 2</span>
                      <div>More nested content</div>
                    </collapsible-item>
                  </collapsible-list>
                </collapsible-item>
              </collapsible-list>
              <pre><code>&lt;collapsible-list&gt;
  &lt;collapsible-item expanded&gt;
    &lt;span slot="header"&gt;Parent Item&lt;/span&gt;
    &lt;collapsible-list&gt;
      &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
      &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
    &lt;/collapsible-list&gt;
  &lt;/collapsible-item&gt;
&lt;/collapsible-list&gt;</code></pre>
            </div>
          </div>

          <div class="example-box">
            <div class="example-box-header">Accordion Mode</div>
            <div class="example-box-content">
              <collapsible-list accordion>
                <collapsible-item>
                  <span slot="header">Item 1</span>
                  <div>Only one item can be open at a time</div>
                </collapsible-item>
                <collapsible-item>
                  <span slot="header">Item 2</span>
                  <div>Clicking another item closes the previous one</div>
                </collapsible-item>
              </collapsible-list>
              <pre><code>&lt;collapsible-list accordion&gt;
  &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
  &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
&lt;/collapsible-list&gt;</code></pre>
            </div>
          </div>

          <div class="example-box">
            <div class="example-box-header">Reverse Heading</div>
            <div class="example-box-content">
              <collapsible-list reverse-heading>
                <collapsible-item>
                  <span slot="header">Toggle on right</span>
                  <div>Content with reverse heading layout</div>
                </collapsible-item>
                <collapsible-item>
                  <span slot="header">Another item</span>
                  <div>More content</div>
                </collapsible-item>
              </collapsible-list>
              <pre><code>&lt;collapsible-list reverse-heading&gt;
  &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
  &lt;collapsible-item&gt;...&lt;/collapsible-item&gt;
&lt;/collapsible-list&gt;</code></pre>
            </div>
          </div>
        </div>
        
        <h2>Properties</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>reverse-heading</code></td>
              <td>Boolean</td>
              <td><code>false</code></td>
              <td>Places the toggle on the right side of child items</td>
            </tr>
            <tr>
              <td><code>accordion</code></td>
              <td>Boolean</td>
              <td><code>false</code></td>
              <td>Only one item can be expanded at a time</td>
            </tr>
            <tr>
              <td><code>aria-label</code></td>
              <td>String</td>
              <td>-</td>
              <td>Accessibility label for the list (recommended)</td>
            </tr>
            <tr>
              <td><code>role</code></td>
              <td>String</td>
              <td><code>'list'</code></td>
              <td>ARIA role for the list</td>
            </tr>
          </tbody>
        </table>
        
        <h2>Events</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Description</th>
              <th>Event.detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>toggle</code></td>
              <td>Fires when an item is expanded or collapsed</td>
              <td><code>{ expanded: boolean, item: HTMLElement }</code></td>
            </tr>
          </tbody>
        </table>

        <h2>Styling</h2>
        <p>Customize the appearance using CSS custom properties:</p>
        
        <pre><code>collapsible-list {
  --indent-size: 1.5rem;  /* Indentation for nested lists */
  --item-spacing: 0.25rem;  /* Spacing between items */
  --nested-indent: 0.5rem;  /* Additional indent for nested lists */
}</code></pre>

        <h2>Accessibility</h2>
        <p>The component includes built-in accessibility features:</p>
        <ul>
          <li>ARIA attributes for screen readers</li>
          <li>Keyboard navigation (Tab, Enter, Space, Arrow keys)</li>
          <li>Proper heading structure</li>
          <li>Focus management</li>
        </ul>

        <div class="highlight">
          <div class="highlight-title">Note</div>
          <p>Always provide an <code>aria-label</code> or <code>aria-labelledby</code> attribute for better accessibility, especially for nested lists.</p>
        </div>
      </div>
    `,customElements.get("collapsible-list")||p(()=>Promise.resolve().then(()=>x),void 0,import.meta.url),customElements.get("collapsible-item")||p(()=>import("./CollapsibleItem-BI6S5VCk.js"),__vite__mapDeps([0,1,2]),import.meta.url)}}customElements.define("collapsible-list-page",w);customElements.get("collapsible-list")||customElements.define("collapsible-list",d);customElements.get("collapsible-item")||customElements.define("collapsible-item",m);customElements.get("selection-menu")||customElements.define("selection-menu",h);customElements.get("image-collection")||customElements.define("image-collection",b);customElements.get("product-layout")||customElements.define("product-layout",g);customElements.get("icon-label")||customElements.define("icon-label",u);document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("app");if(!a)return;a.innerHTML=`
        <docs-layout>
            <docs-router>
                <home-page path="/"></home-page>
                <collapsible-list-page path="/collapsible-list"></collapsible-list-page>
                <collapsible-item-page path="/collapsible-item"></collapsible-item-page>
                <icon-label-page path="/icon-label"></icon-label-page>
                <selection-menu-page path="/selection-menu"></selection-menu-page>
                <image-collection-page path="/image-collection"></image-collection-page>
                <product-layout-page path="/product-layout"></product-layout-page>
            </docs-router>
        </docs-layout>
    `;function t(){const e=window.location.hash.replace(/^#\/?/,"/")||"/";document.querySelectorAll("docs-layout .nav-link").forEach(i=>{const o=i.getAttribute("href").replace(/^#/,"");e==="/"&&o==="/"||e!=="/"&&o.includes(e)?i.classList.add("active"):i.classList.remove("active")})}window.addEventListener("popstate",t),t()});
