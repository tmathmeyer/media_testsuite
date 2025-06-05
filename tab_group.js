class TabGroupComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.tabEntries = [];
  }

  connectedCallback() {
    customElements.whenDefined('tab-entry').then(() => {
      this.tabEntries = Array.from(this.querySelectorAll('tab-entry'));

      if (this.tabEntries.length > 0) {
        // Check if the first entry is indeed a TabEntryComponent with the method
        // and has been fully upgraded.
        const firstTab = this.tabEntries[0];
        if (firstTab instanceof HTMLElement && typeof firstTab.activate === 'function') {
          this.setActiveTab(firstTab);
        } else {
          // Handle cases where it's not ready - perhaps retry or log error
          console.warn('First tab-entry not fully ready with methods after whenDefined. Attempting microtask delay.');
          // As a fallback, try to re-query and set after a microtask
          Promise.resolve().then(() => {
              this.tabEntries = Array.from(this.querySelectorAll('tab-entry')); // Re-query
              if (this.tabEntries.length > 0) {
                const currentFirstTab = this.tabEntries[0];
                if (typeof currentFirstTab.activate === 'function') {
                    this.setActiveTab(currentFirstTab);
                } else {
                    // If methods still not there, use the attribute fallback as a last resort
                    console.warn('Fallback: Activating first tab via attributes due to still missing activate method.', currentFirstTab);
                    currentFirstTab.setAttribute('aria-selected', 'true');
                    currentFirstTab.setAttribute('tabindex', '0');
                    // And ensure others are deactivated (attribute-based)
                    for (let i = 1; i < this.tabEntries.length; i++) {
                        this.tabEntries[i].setAttribute('aria-selected', 'false');
                        this.tabEntries[i].setAttribute('tabindex', '-1');
                    }
                }
              }
          });
        }
      }
    }).catch(error => {
      console.error("Error waiting for tab-entry definition:", error);
    });
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
