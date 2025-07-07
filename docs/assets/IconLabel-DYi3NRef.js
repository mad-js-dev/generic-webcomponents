class l extends HTMLElement{static get observedAttributes(){return["icon","label","reverse"]}constructor(){super(),this.attachShadow({mode:"open"}),this._icon="",this._label="",this._reverse=!1,this._initialized=!1}connectedCallback(){this._initialized||(this._initializeComponent(),this._initialized=!0),this._render()}_initializeComponent(){const t=document.createElement("style");t.textContent=`
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
    `;const i=document.createElement("span");i.className="icon-label",i.setAttribute("part","container");const e=document.createElement("slot");e.name="icon",e.className="icon-label__icon",e.setAttribute("part","icon");const n=document.createElement("slot");n.className="icon-label__label",n.setAttribute("part","label"),i.appendChild(e),i.appendChild(n),this.shadowRoot.appendChild(t),this.shadowRoot.appendChild(i),this._container=i,this._iconSlot=e,this._labelSlot=n}_render(){if(!this._initialized)return;if(this._container.className="icon-label",this._reverse&&this._container.classList.add("icon-label--reverse"),this._icon&&this._iconSlot)if(this._iconSlot.innerHTML="",this._icon.length===1||this._icon.length===2&&this._icon.codePointAt(0)>65535){const e=document.createElement("span");e.className="icon-label__char",e.textContent=this._icon,this._iconSlot.appendChild(e)}else{const e=document.createElement("img");e.src=this._icon,e.alt="",this._iconSlot.appendChild(e)}const t=this._label||this.textContent.trim();if(t&&this._labelSlot)if(this._labelSlot.textContent="",!this._label&&this.textContent.trim())for(;this.firstChild;)this._labelSlot.appendChild(this.firstChild);else this._labelSlot.textContent=t}get icon(){return this._icon}set icon(t){this._icon=t,this.setAttribute("icon",t)}get label(){return this._label||this.textContent.trim()}set label(t){this._label=t,this._labelSlot&&(this._labelSlot.textContent=t)}get reverse(){return this._reverse}set reverse(t){this._reverse=t!==null&&t!==!1,this._render()}attributeChangedCallback(t,i,e){if(i!==e)switch(t){case"icon":this._icon=e||"";break;case"label":this._label=e||"",this._labelSlot&&(this._labelSlot.textContent=this._label);break;case"reverse":this._reverse=e!==null,this._render();break}}}customElements.get("icon-label")||customElements.define("icon-label",l);export{l as I};
