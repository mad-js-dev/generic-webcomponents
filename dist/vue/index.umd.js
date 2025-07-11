(function(m,u){typeof exports=="object"&&typeof module<"u"?module.exports=u():typeof define=="function"&&define.amd?define(u):(m=typeof globalThis<"u"?globalThis:m||self,m.GenericWebComponentsVue=u())})(this,function(){"use strict";class m extends HTMLElement{static get observedAttributes(){return["reverse-heading","single-item","accordion"]}constructor(){super(),this.attachShadow({mode:"open"}),this._isUpdating=!1,this._handleItemToggle=this._handleItemToggle.bind(this);const e=document.createElement("div"),i=document.createElement("slot"),t=document.createElement("style");t.textContent=`
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
      }`,e.appendChild(i),this.shadowRoot.append(t,e)}async connectedCallback(){this._initialized||(this._initializeComponent(),this._initialized=!0,await this._updateReverseHeading(),this.addEventListener("toggle",this._handleItemToggle),this.hasAttribute("accordion")&&this._ensureOneItemExpanded()),this._setupMutationObserver()}_initializeComponent(){this.hasAttribute("role")||this.setAttribute("role","list"),!this.hasAttribute("aria-label")&&!this.hasAttribute("aria-labelledby")&&console.warn("collapsible-list: Add an aria-label or aria-labelledby attribute for accessibility")}_setupMutationObserver(){this._observer=new MutationObserver(async e=>{let i=!1;for(const t of e)if(t.type==="attributes"&&t.attributeName==="reverse-heading"){i=!0;break}else if(t.type==="childList"){for(const s of t.addedNodes)if(s.nodeType===Node.ELEMENT_NODE&&(s.matches("collapsible-item")||s.matches("collapsible-list"))){i=!0;break}if(i)break}i&&await this._updateReverseHeading()}),this._observer.observe(this,{attributes:!0,attributeFilter:["reverse-heading"],childList:!0,subtree:!0})}async _updateReverseHeading(){if(!this._isUpdating){this._isUpdating=!0;try{const e=this.hasAttribute("reverse-heading")&&this.getAttribute("reverse-heading")!=="false";this._observer&&this._observer.disconnect();const i=async n=>{for(const l of n){e?l.setAttribute("reverse-heading",""):l.removeAttribute("reverse-heading");const r=l.querySelectorAll(":scope > collapsible-item");r.length>0&&await i(Array.from(r));const d=l.querySelectorAll(":scope > collapsible-list");d.length>0&&await t(Array.from(d))}},t=async n=>{for(const l of n){if(l===this)continue;e?l.setAttribute("reverse-heading",""):l.removeAttribute("reverse-heading");const r=l.querySelectorAll(":scope > collapsible-item");r.length>0&&await i(Array.from(r));const d=l.querySelectorAll(":scope > collapsible-list");d.length>0&&await t(Array.from(d))}},s=this.querySelectorAll(":scope > collapsible-item");s.length>0&&await i(Array.from(s));const o=this.querySelectorAll(":scope > collapsible-list");o.length>0&&await t(Array.from(o)),this.shadowRoot&&this.shadowRoot.offsetHeight}catch(e){console.error("Error updating reverse heading:",e)}finally{this._observer&&this._observer.observe(this,{attributes:!0,attributeFilter:["reverse-heading"],childList:!0,subtree:!0}),this._isUpdating=!1}}}_handleItemToggle(e){if(this._isUpdating)return;const i=e.target;i.parentElement===this&&(this._isUpdating=!0,this.hasAttribute("accordion")?i.expanded&&this._closeOtherItems(i):this.hasAttribute("single-item")&&i.expanded&&this._closeOtherItems(i),this._isUpdating=!1)}_closeOtherItems(e){if(this.closest("image-collection"))return;this.querySelectorAll("collapsible-item").forEach(t=>{t!==e&&(t.expanded=!1)})}_getOpenItems(){return Array.from(this.querySelectorAll("collapsible-item[expanded]"))}_ensureOneItemExpanded(){if(!this.hasAttribute("accordion"))return;if(this._getOpenItems().length===0){const i=this.querySelector("collapsible-item");i&&i.setAttribute("expanded","")}}}customElements.get("collapsible-list")||customElements.define("collapsible-list",m);class u extends HTMLElement{static get observedAttributes(){return["icon","label","reverse"]}constructor(){super(),this.attachShadow({mode:"open"}),this._icon="",this._label="",this._reverse=!1,this._initialized=!1}connectedCallback(){this._initialized||(this._initializeComponent(),this._initialized=!0),this._render()}_initializeComponent(){const e=document.createElement("style");e.textContent=`
      :host {
        display: inline-flex;
        align-items: center;
        font-family: inherit;
        color: currentColor;
      }

      .icon-label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .icon-label--reverse {
        flex-direction: row-reverse;
      }

      .icon-label__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1em;
        height: 1em;
      }
      
      .icon-label__icon img,
      .icon-label__char {
        width: 1em;
        height: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .icon-label__char {
        font-size: 1em;
        line-height: 1;
      }
    `;const i=document.createElement("span");i.className="icon-label",i.setAttribute("part","container");const t=document.createElement("slot");t.name="icon",t.className="icon-label__icon",t.setAttribute("part","icon");const s=document.createElement("slot");s.className="icon-label__label",s.setAttribute("part","label"),i.appendChild(t),i.appendChild(s),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(i),this._container=i,this._iconSlot=t,this._labelSlot=s}_render(){if(!this._initialized)return;if(this._container.className="icon-label",this._reverse&&this._container.classList.add("icon-label--reverse"),this._icon&&this._iconSlot)if(this._iconSlot.innerHTML="",this._icon.length===1||this._icon.length===2&&this._icon.codePointAt(0)>65535){const t=document.createElement("span");t.className="icon-label__char",t.textContent=this._icon,this._iconSlot.appendChild(t)}else{const t=document.createElement("img");t.src=this._icon,t.alt="",this._iconSlot.appendChild(t)}const e=this._label||this.textContent.trim();if(e&&this._labelSlot)if(this._labelSlot.textContent="",!this._label&&this.textContent.trim())for(;this.firstChild;)this._labelSlot.appendChild(this.firstChild);else this._labelSlot.textContent=e}get icon(){return this._icon}set icon(e){this._icon=e,this.setAttribute("icon",e)}get label(){return this._label||this.textContent.trim()}set label(e){this._label=e,this._labelSlot&&(this._labelSlot.textContent=e)}get reverse(){return this._reverse}set reverse(e){this._reverse=e!==null&&e!==!1,this._render()}attributeChangedCallback(e,i,t){if(i!==t)switch(e){case"icon":this._icon=t||"";break;case"label":this._label=t||"",this._labelSlot&&(this._labelSlot.textContent=this._label);break;case"reverse":this._reverse=t!==null,this._render();break}}}customElements.get("icon-label")||customElements.define("icon-label",u);class g extends HTMLLIElement{static get observedAttributes(){return["expanded","icon","label","removeshift","hide-icon"]}constructor(){super(),this._isExpanded=!1,this._handleClick=this._handleClick.bind(this),this._header=null,this._content=null,this._initialRender=!0,this._removeShift=!1,this.rendered=!1,this.classList.add("collapsible-item"),this.hasAttribute("expanded")&&(this._isExpanded=!0,this.classList.add("collapsible-item--expanded")),this.hasAttribute("removeshift")&&this.classList.add("collapsible-item--no-padding")}connectedCallback(){this.hasAttribute("role")||this.setAttribute("role","listitem"),this.rendered||(this._render(),this.rendered=!0,this._addEventListeners(),this._updateContentVisibility()),this.classList.add("collapsible-item"),this.hasAttribute("expanded")?(this._isExpanded=!0,this.classList.add("collapsible-item--expanded")):(this._isExpanded=!1,this.classList.remove("collapsible-item--expanded"))}disconnectedCallback(){this._removeEventListeners()}_addEventListeners(){this.addEventListener("click",this._handleClick)}_removeEventListeners(){this.removeEventListener("click",this._handleClick)}_handleClick(e){if(!e.target.closest(".collapsible-item__header"))return;e.preventDefault(),e.stopPropagation();const t=!this.hasAttribute("expanded");t?this.setAttribute("expanded",""):this.removeAttribute("expanded"),this._isExpanded=t,this._updateContentVisibility(),this.dispatchEvent(new CustomEvent("toggle",{detail:{expanded:t},bubbles:!0,composed:!0}))}_createHeader(){const e=document.createElement("div");e.className="collapsible-item__header";const i=document.createElement("div");i.style.display="flex",i.style.alignItems="center",i.style.flex="1";const t=this.hasAttribute("hide-icon"),s=this.getAttribute("icon");if(s&&!t){const n=document.createElement("span");n.className="collapsible-item__icon",n.textContent=s,n.style.marginRight="0.5rem",i.appendChild(n)}const o=this.getAttribute("label")||"";if(o){const n=document.createElement("span");n.className="collapsible-item__label",n.textContent=o,i.appendChild(n)}return e.appendChild(i),e}_render(){if(!this._isRendering){this._isRendering=!0;const e=[];for(Array.from(this.children).forEach(i=>{i!==this._header&&i!==this._content&&e.push(i)});this.firstChild;)this.removeChild(this.firstChild);this._header=this._createHeader(),this.appendChild(this._header),this._header&&(this._header.setAttribute("role","button"),this._header.setAttribute("aria-expanded",this._isExpanded?"true":"false"),this._header.setAttribute("tabindex","0"),this._header.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),this._toggleExpanded())})),this._content=this._createContent(),this._content&&(this.appendChild(this._content),e.forEach(i=>{this._content.appendChild(i)})),this.setAttribute("role","listitem"),this._updateContentVisibility(),this.rendered=!0,this._isRendering=!1}}_createContent(){const e=document.createElement("div");e.className="collapsible-item__content";const i=this.querySelectorAll(".collapsible-item__header, .collapsible-item__label, .collapsible-item__icon"),t=new Set(i);return Array.from(this.childNodes).filter(o=>o.nodeType===Node.ELEMENT_NODE?!t.has(o)&&!o.closest(".collapsible-item__header"):o.nodeType===Node.TEXT_NODE?o.textContent.trim()!==""&&!o.textContent.includes("▶")&&!o.textContent.includes("▼"):!1).forEach(o=>{e.appendChild(o.cloneNode(!0))}),e}get expanded(){return this._isExpanded}set expanded(e){this._isExpanded!==e&&(this._isExpanded=e,this._isExpanded?this.setAttribute("expanded",""):this.removeAttribute("expanded"),this._updateContentVisibility(),this.dispatchEvent(new CustomEvent("toggle",{detail:{expanded:this._isExpanded},bubbles:!0,composed:!0})))}_toggleExpanded(){this._isExpanded=!this._isExpanded,this._isExpanded?this.setAttribute("expanded",""):this.removeAttribute("expanded"),this._updateContentVisibility(),this.dispatchEvent(new CustomEvent("toggle",{detail:{expanded:this._isExpanded},bubbles:!0,composed:!0}))}_updateContentVisibility(){if(!this._content||!this._header)return;const e=this.hasAttribute("hide-icon");this._isExpanded?(this._content.classList.add("collapsible-item__content--expanded"),this._content.style.display="block",this._header.setAttribute("aria-expanded","true"),this.classList.add("collapsible-item--expanded"),e||this.setAttribute("icon","▼")):(this._content.classList.remove("collapsible-item__content--expanded"),this._content.style.display="none",this._header.setAttribute("aria-expanded","false"),this.classList.remove("collapsible-item--expanded"),e||this.setAttribute("icon","▶"))}attributeChangedCallback(e,i,t){if(e==="removeshift")this._removeShift=t!==null,this._removeShift?this.classList.add("collapsible-item--no-padding"):this.classList.remove("collapsible-item--no-padding");else if(e==="hide-icon"&&this._header){const s=this._header.querySelector(".collapsible-item__icon");if(t!==null)s&&s.remove();else if(this.hasAttribute("icon")&&!s){const o=this.getAttribute("icon"),n=document.createElement("span");n.className="collapsible-item__icon",n.textContent=o,n.style.marginRight="0.5rem";const l=this._header.firstElementChild;l&&l.insertBefore(n,l.firstChild)}}else if(e==="expanded"){const s=this._isExpanded;this._isExpanded=t!==null,this._isExpanded!==s&&this._updateContentVisibility()}else if(e==="icon"&&this._header){let s=this._header.querySelector(".collapsible-item__icon");t?(s||(s=document.createElement("span"),s.className="collapsible-item__icon",this._header.insertBefore(s,this._header.firstChild)),s.textContent=t):s&&this._header.removeChild(s)}else if(e==="label"&&this._header){let s=this._header.querySelector(".collapsible-item__label");s?s.textContent=t||"":t&&(s=document.createElement("span"),s.className="collapsible-item__label",s.textContent=t,this._header.appendChild(s))}}}const _="collapsible-item";typeof window<"u"&&window.customElements&&(window.customElements.get(_)&&(window.customElements.get(_),delete window.customElements._elements[_]),window.customElements.define(_,g,{extends:"li"}));const E=Object.freeze(Object.defineProperty({__proto__:null,CollapsibleItem:g},Symbol.toStringTag,{value:"Module"}));let f={};async function C(){try{const a=await Promise.resolve().then(()=>S);f.SelectionMenu=a.default||a}catch(a){console.warn("SelectionMenu component not found or failed to load",a)}try{const a=await Promise.resolve().then(()=>L);f.ProductLayout=a.default||a}catch(a){console.warn("ProductLayout component not found or failed to load",a)}return f}function v(){return f}const A=Object.freeze(Object.defineProperty({__proto__:null,CollapsibleItem:g,CollapsibleList:m,getAdditionalComponents:v,loadAdditionalComponents:C},Symbol.toStringTag,{value:"Module"}));function b(){return Promise.all([customElements.whenDefined("collapsible-list"),customElements.whenDefined("collapsible-item"),customElements.whenDefined("icon-label"),customElements.whenDefined("selection-menu"),customElements.whenDefined("image-collection"),customElements.whenDefined("product-layout")])}typeof window<"u"&&!window.__GENERIC_WEBCOMPONENTS_DEFINED__&&(window.__GENERIC_WEBCOMPONENTS_DEFINED__=!0,b().catch(console.error));const w={install(a){b().catch(console.error),Object.entries(A).forEach(([e,i])=>{if(typeof i=="function"&&i.name){const t=i.is||e.toLowerCase(),s={name:e,inheritAttrs:!1,emits:[],props:{},render(){const o=Object.entries(this.$attrs).reduce((l,[r,d])=>{const c=r.replace(/-([a-z])/g,h=>h[1].toUpperCase());return l[c]=d,l},{}),n={};return Object.keys(this.$listeners).forEach(l=>{n[l]=this.$listeners[l]}),this.$createElement(t,{attrs:o,on:n,ref:"webComponent"},this.$slots.default)}};a.component(e,s)}})}};class y extends HTMLElement{static get observedAttributes(){return["items","selected"]}constructor(){super(),this.attachShadow({mode:"open"}),this._items=[],this._selectedId=null,this._boundOnItemClick=this._onItemClick.bind(this),Promise.resolve().then(()=>E)}connectedCallback(){this._render()}disconnectedCallback(){this._removeEventListeners()}attributeChangedCallback(e,i,t){if(i!==t)switch(e){case"items":this._items=t?JSON.parse(t):[],this._render();break;case"selected":this._selectedId=t,this._updateSelectedState();break}}get items(){return JSON.stringify(this._items)}set items(e){this._items=e?JSON.parse(e):[],this._render()}get selected(){return this._selectedId}set selected(e){this._selectedId!==e&&(this._selectedId=e,this._updateSelectedState())}_render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`
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
    `,this._addEventListeners())}_renderItems(e,i=0){if(!e||!e.length)return"";const t=document.createElement("ul");return t.style.listStyle="none",t.style.padding="0",t.style.margin="0",e.forEach(s=>{const o=s.children&&s.children.length>0,n=this._selectedId===s.id,l=document.createElement("li");if(l.setAttribute("data-id",s.id),o){l.setAttribute("is","collapsible-item"),l.setAttribute("data-id",s.id),l.setAttribute("label",s.name);const d=this._hasSelectedDescendant(s)||n;d&&l.setAttribute("expanded",""),l.setAttribute("icon",d?"▼":"▶"),l.style.marginRight="8px",l.style.transition="transform 0.2s ease",n&&l.classList.add("menu-item--selected");const c=document.createElement("ul");c.className="menu-item__child-list",c.innerHTML=this._renderItems(s.children,i+1);const h=document.createElement("div");h.slot="content",h.className="menu-item__content",h.appendChild(c),l.appendChild(h),l.addEventListener("toggle",k=>{h.style.display=k.detail.expanded?"block":"none"})}else{const r=document.createElement("span");r.className="menu-item__leaf",n&&r.classList.add("menu-item--selected");const d=document.createElement("span");d.className="menu-item__label",d.textContent=s.name,r.appendChild(d),r.addEventListener("click",c=>{c.stopPropagation(),this._selectedId=s.id,this._updateSelectedState(),this.dispatchEvent(new CustomEvent("item-selected",{detail:{id:s.id,item:s,name:s.name},bubbles:!0,composed:!0}))}),l.appendChild(r)}t.appendChild(l)}),i===0?t.outerHTML:t.innerHTML}_addEventListeners(){this.shadowRoot.addEventListener("click",this._boundOnItemClick)}_removeEventListeners(){this.shadowRoot.removeEventListener("click",this._boundOnItemClick)}_onItemClick(e){const i=e.target.closest(".menu-item__leaf");if(i){e.stopPropagation();const o=i.getAttribute("data-id");o&&(this.selected=o,this._updateSelectedState(),this.dispatchEvent(new CustomEvent("item-selected",{detail:{id:o},bubbles:!0,composed:!0})));return}const t=e.target.closest(".collapsible-item__header");if(!t)return;const s=t.parentElement;if(s&&s.getAttribute("is")==="collapsible-item"){e.stopPropagation();const o=s.hasAttribute("expanded"),n=s.querySelector(".menu-item__arrow");o?(s.removeAttribute("expanded"),n&&(n.textContent="▶")):(s.setAttribute("expanded",""),n&&(n.textContent="▼")),s.dispatchEvent(new CustomEvent("toggle",{detail:{expanded:!o},bubbles:!0,composed:!0}))}}_updateSelectedState(){if(!this.shadowRoot)return;const e=this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'),i=this.shadowRoot.querySelectorAll(".menu-item__leaf");if(e.forEach(t=>{t.classList.remove("menu-item--selected"),t.removeAttribute("selected")}),i.forEach(t=>{t.classList.remove("menu-item--selected")}),this._selectedId){const t=this.shadowRoot.querySelector(`li[is="collapsible-item"][data-id="${this._selectedId}"]`);t&&(t.classList.add("menu-item--selected"),t.setAttribute("selected",""));const s=this.shadowRoot.querySelector(`li[data-id="${this._selectedId}"] .menu-item__leaf`);s&&s.classList.add("menu-item--selected"),!t&&!s&&console.warn("Could not find selected item in the DOM. It might be in a closed collapsible section.")}}_hasSelectedDescendant(e){return e?e.id===this._selectedId?!0:e.children?e.children.some(i=>this._hasSelectedDescendant(i)):!1:!1}_findItemById(e,i){if(!e||!e.length)return null;for(const t of e){if(t.id===i)return t;if(t.children){const s=this._findItemById(t.children,i);if(s)return s}}return null}}customElements.get("selection-menu")||customElements.define("selection-menu",y);const S=Object.freeze(Object.defineProperty({__proto__:null,SelectionMenu:y},Symbol.toStringTag,{value:"Module"}));class I extends HTMLElement{static get observedAttributes(){return["images"]}constructor(){super(),this.attachShadow({mode:"open"}),this._images=[],this._handleToggle=this._handleToggle.bind(this),this._currentOpenIndex=0}get images(){return this._images}set images(e){if(Array.isArray(e))this._images=e,this.render();else if(typeof e=="string")try{this._images=JSON.parse(e),this.render()}catch{}}connectedCallback(){this.render(),this.shadowRoot.addEventListener("toggle",this._handleToggle)}disconnectedCallback(){this.shadowRoot.removeEventListener("toggle",this._handleToggle)}_handleToggle(e){if(e.stopPropagation(),this._isHandlingToggle)return;this._isHandlingToggle=!0;let i=-1,t=!1;try{const s=e.composedPath().find(n=>n.nodeType===Node.ELEMENT_NODE&&n.getAttribute&&n.getAttribute("is")==="collapsible-item");if(!s)return;const o=Array.from(this.shadowRoot.querySelectorAll('li[is="collapsible-item"]'));if(i=o.indexOf(s),i===-1||i===this._currentOpenIndex)return;t=s.expanded,o.forEach((n,l)=>{l!==i&&n.expanded&&(n.expanded=!1)}),i===this._currentOpenIndex?(s.expanded=!1,this._currentOpenIndex=-1):(s.expanded=!0,this._currentOpenIndex=i)}finally{this._isHandlingToggle=!1}this.dispatchEvent(new CustomEvent("toggle",{detail:{index:i,expanded:!t,source:"image-collection"},bubbles:!0,composed:!0}))}_onItemToggle(e){e.stopPropagation();const i=e.target.closest('li[is="collapsible-item"]');if(!i)return;const t=Array.from(this.shadowRoot.querySelectorAll('li[is="collapsible-item"]')),s=t.indexOf(i);if(s!==-1){if(!e.detail.expanded){this._currentOpenIndex===s&&(this._currentOpenIndex=-1);return}if(this._currentOpenIndex!==-1&&this._currentOpenIndex!==s){const o=t[this._currentOpenIndex];o&&o.toggle(!1)}this._currentOpenIndex=s}}render(){this.shadowRoot&&(this._currentOpenIndex===-1&&this._images.length>0&&(this._currentOpenIndex=0),this.shadowRoot.innerHTML=`
            <style>
                .image-collection {
                    width: 100%;
                    max-width: 800px;
                    margin: 0 auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
                
                .image-collection__container {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    width: 100%;
                    list-style: none;
                    padding: 0;
                }
                
                .image-collection__item {
                    width: 100%;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .image-collection__image {
                    width: 100%;
                    height: auto;
                    display: block;
                }
                
                .image-collection__title {
                    font-weight: 600;
                    padding: 0.8rem 1rem;
                    background-color: #f8fafc;
                    width: 100%;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .image-collection__title:hover {
                    background-color: #f1f5f9;
                }
                
                .image-collection .collapsible-item__header {
                    padding: 0.5rem 1rem;
                    background: none;
                    border: none;
                    width: 100%;
                    text-align: left;
                    cursor: pointer;
                }
                
                .image-collection .collapsible-item__content {
                    margin: 0;
                    transition: all 0.3s ease;
                }
                
                .image-collection li[is="collapsible-item"] {
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .image-collection li[is="collapsible-item"]:last-child {
                    margin-bottom: 0;
                }
            </style>
            <div class="image-collection">
                <ul class="image-collection__container">
                    ${this._images.map((e,i)=>`
                        <li is="collapsible-item" 
                            label="${e.title}" 
                            ${e.removeshift?'removeshift="true"':""}
                            ${this._currentOpenIndex===i?"expanded":""}
                            hide-icon
                            >
                            <div slot="content">
                                <img 
                                    class="image-collection__image" 
                                    src="${e.src}" 
                                    alt="${e.title}"
                                    loading="lazy"
                                >
                            </div>
                        </li>
                    `).join("")}
                </ul>
            </div>
        `)}}customElements.get("image-collection")||customElements.define("image-collection",I);const p=[{title:"Nature",src:"images/samples/nature.jpg",alt:"Scenic nature landscape",description:"A beautiful landscape showcasing nature's beauty."},{title:"Architecture",src:"images/samples/architecture.jpg",alt:"Modern architecture building",description:"Stunning modern architecture design."},{title:"Technology",src:"images/samples/technology.jpg",alt:"Technology circuit board",description:"Close-up of an advanced circuit board."}];class x extends HTMLElement{static get observedAttributes(){return["title","images"]}constructor(){super(),this.attachShadow({mode:"open"}),this._title="Product Name",this._images=[],this._isConnected=!1,this._hasRendered=!1,this._isUpdating=!1,this._elements=null,this._render=this._render.bind(this)}connectedCallback(){this._isConnected=!0,this._render()}disconnectedCallback(){this._isConnected=!1}attributeChangedCallback(e,i,t){if(i!==t){if(e==="title")this._title=t||"Product Name",this._updateTitle();else if(e==="images")if(typeof t=="string")try{const s=JSON.parse(t);this.images=Array.isArray(s)?s:[]}catch(s){console.error("Invalid images JSON:",s),this.images=[]}else Array.isArray(t)?this.images=t:this.images=[]}}get title(){return this._title}set title(e){this._title!==e&&(this._title=e||"",this._updateTitle())}get images(){return this._images}set images(e){if(Array.isArray(e))this._images=e.length>0?e:[...p];else if(typeof e=="string")try{const i=JSON.parse(e);this._images=Array.isArray(i)?i:[...p]}catch(i){console.error("Invalid images JSON:",i),this._images=[...p]}else this._images=[...p];this._updateImages()}_updateTitle(){var e;(e=this._elements)!=null&&e.title&&(this._elements.title.textContent=this._title)}_updateImages(){var e;(e=this._elements)!=null&&e.imageCollection&&(this._elements.imageCollection.images=[...this._images],this._elements.imageCollectionContainer&&(this._elements.imageCollectionContainer.style.display="block"))}_render(){if(!(this._isUpdating||!this.shadowRoot)){this._isUpdating=!0;try{this._hasRendered||(this.shadowRoot.innerHTML=`
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
        `,this._elements={title:this.shadowRoot.getElementById("title"),content:this.shadowRoot.getElementById("content"),imageCollection:this.shadowRoot.getElementById("imageCollection"),imageCollectionContainer:this.shadowRoot.getElementById("imageCollectionContainer")},this._images.length===0&&(this._images=[...p]),this._hasRendered=!0),this._updateTitle(),this._updateImages()}finally{this._isUpdating=!1}}}}typeof window<"u"&&!customElements.get("product-layout")&&customElements.define("product-layout",x);const L=Object.freeze(Object.defineProperty({__proto__:null,ProductLayout:x},Symbol.toStringTag,{value:"Module"}));return w});
//# sourceMappingURL=index.umd.js.map
