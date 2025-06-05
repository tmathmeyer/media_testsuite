class TabEntryComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block; /* Or block, depending on layout needs */
          cursor: pointer;
        }
        #panel-container {
          display: none; /* Initially hidden */
        }
        :host([aria-selected="true"]) #panel-container {
          display: block;
        }
        /* Basic styling for focus state, can be improved */
        :host(:focus-visible) slot[name="tab-title"] {
            outline: 2px solid blue;
            outline-offset: 2px;
        }
      </style>
      <div id="title-container" part="title">
        <slot name="tab-title"></slot>
      </div>
      <div id="panel-container" part="panel">
        <slot name="tab-panel"></slot>
      </div>
    `;
    this.setAttribute('role', 'tab');
    // Default tabindex, will be updated by TabGroupComponent or activate/deactivate
    this.setAttribute('tabindex', '-1');
    this.setAttribute('aria-selected', 'false');
  }

  connectedCallback() {
    const titleSlot = this.shadowRoot.querySelector('slot[name="tab-title"]');
    const panelSlot = this.shadowRoot.querySelector('slot[name="tab-panel"]');

    // Ensure title and panel elements are available
    // The actual elements are in the light DOM and slotted
    const titleElement = this.querySelector('[slot="tab-title"]');
    const panelElement = this.querySelector('[slot="tab-panel"]');

    if (titleElement) {
      if (!titleElement.id) {
        // Generate a unique ID for the title if it doesn't have one
        titleElement.id = `tab-title-${Math.random().toString(36).substr(2, 9)}`;
      }
      if (panelElement) {
        panelElement.setAttribute('role', 'tabpanel');
        panelElement.setAttribute('aria-labelledby', titleElement.id);
        // Initial hidden state for the panel is managed by CSS in shadow DOM
        // based on host's aria-selected attribute
      }
    }

    // Event listener on the host element or title container
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);


    // Initial state: panel is hidden by default CSS in shadow DOM
    // TabGroupComponent will call activate() on the default active tab.
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
  }

  _onClick() {
    const parentGroup = this.closest('tab-group');
    if (parentGroup && typeof parentGroup.setActiveTab === 'function') {
      parentGroup.setActiveTab(this);
    }
  }

  _onKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._onClick(); // Trigger tab selection
    }
  }

  activate() {
    this.setAttribute('aria-selected', 'true');
    this.setAttribute('tabindex', '0');
    // Panel visibility is handled by CSS in shadow DOM via :host([aria-selected="true"])
  }

  deactivate() {
    this.setAttribute('aria-selected', 'false');
    this.setAttribute('tabindex', '-1');
    // Panel visibility is handled by CSS in shadow DOM
  }
}

customElements.define('tab-entry', TabEntryComponent);
