
export class StyledElement extends HTMLElement {
  static observedAttributes = ["theme"];

  constructor() {
    super();
    this._setup_shadow_dom();
  }
  _setup_shadow_dom() {
    if (this._shadow === null || this._shadow === undefined) {
      this._shadow = this.attachShadow({ mode: "open" });
      this._theme = document.createElement("link");
      this._theme.setAttribute("rel", "stylesheet");
      this._shadow.appendChild(this._theme);
      for (const component_style_url of this.GetComponentStyles()) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", component_style_url);
        this._shadow.appendChild(link);
      }
    }
  }
  GetComponentStyles() {
    return []
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "theme") {
      this._theme.setAttribute("href", newValue);
    }
  }
};