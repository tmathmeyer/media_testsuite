
import { StyledElement } from "./shared.js";


customElements.define('ux-video-selector', class extends StyledElement {

  static observedAttributes = ["render", "src"];

  constructor() {
    super();

    this._video_srcs = [];
    this.LoadDirectSources(this.getElementsByTagName('ux-video-sources'));

    const leftside = document.createElement('div');
    leftside.classList.add('leftside');
    this._shadow.appendChild(leftside);

    this.srclist = document.createElement('div');
    this.srclist.classList.add('rightside');
    this._shadow.appendChild(this.srclist);

    this.video_element = document.createElement('video');
    leftside.appendChild(this.video_element);

    this.controls_panel = document.createElement('div');
    this.controls_panel.classList.add('controls');
    leftside.appendChild(this.controls_panel);
  }

  LoadDirectSources(sources) {
    if (sources.length === 0) {
      return;
    }
    const sourcelist = sources[0].children;
    for (let i = 0; i < sourcelist.length; i++) {
      const source = sourcelist[i];
      this._video_srcs.push(source.getAttribute('src'));
    }
  }

  GetComponentStyles() {
    return ['video.css']
  }

  RenderGrid() {

  }

  RenderList() {

  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name == "render") {
      if (newValue === "list") {
        this.RenderList();
      } else if (newValue == "grid") {
        this.RenderGrid();
      }
    }
    if (name == "src") {
      // Load from the nginx list page.
    }
  }
});
