class TabGroupComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.tabEntries = [];
  }

  connectedCallback() {
    this.tabEntries = Array.from(this.querySelectorAll('tab-entry'));

    if (this.tabEntries.length > 0) {
      this.setActiveTab(this.tabEntries[0]);
    }
  }

  setActiveTab(tabEntryToActivate) {
    this.tabEntries.forEach(entry => {
      if (entry === tabEntryToActivate) {
        if (typeof entry.activate === 'function') {
          entry.activate();
        } else {
          // Fallback or error if activate method doesn't exist, though it should.
          console.warn('TabEntryComponent is missing activate() method', entry);
          // Basic attribute setting as a minimal fallback if methods aren't there
          entry.setAttribute('aria-selected', 'true');
          entry.setAttribute('tabindex', '0');
        }
      } else {
        if (typeof entry.deactivate === 'function') {
          entry.deactivate();
        } else {
          // Fallback or error
          console.warn('TabEntryComponent is missing deactivate() method', entry);
          entry.setAttribute('aria-selected', 'false');
          entry.setAttribute('tabindex', '-1');
        }
      }
    });
  }
}

customElements.define('tab-group', TabGroupComponent);
