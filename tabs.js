
import { StyledElement } from "./shared.js";

customElements.define('ux-tab-entry', class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.titleElement = this.children[0];
    this.contentElement = this.children[1];
  }
});


class TabImpl {
  constructor(tab_group, title, titlenode, contentnode) {
    this.title = title;
    this.selected = false;
    this._tab_group = tab_group;
    this._titlenode = titlenode;
    this._contentnode = contentnode;

    this._titlenode.addEventListener('click', () => {
      this.Select();
    });
  }

  Select() {
    this._tab_group.SelectTab(this);
  }
}

customElements.define('ux-tab-group', class extends StyledElement {
  constructor() {
    super();

    this.tabs = [];
    this.selected_tab = null;

    this.titlebar = document.createElement('ul');
    this.titlebar.classList.add('titlebar');
    this._shadow.appendChild(this.titlebar);

    this.content = document.createElement('div');
    this.content.classList.add('backbuffer');
    this._shadow.appendChild(this.content);

    this.renderframe = document.createElement('div');
    this.renderframe.classList.add('renderframe');
    this._shadow.appendChild(this.renderframe);
  }

  GetComponentStyles() {
    return ['tabs.css']
  }

  connectedCallback() {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child.tagName == 'UX-TAB-ENTRY') {
        const menu_entry = document.createElement('li');
        menu_entry.appendChild(child.titleElement);
        this.titlebar.appendChild(menu_entry);
        this.content.appendChild(child.contentElement);
        this.tabs.push(new TabImpl(
          this, child.titleElement.innerText, child.titleElement, child.contentElement));
      }
    }

    if (this.tabs.length > 0) {
      this.tabs[0].Select();
    }
  }

  StopMediaContent(containernode) {

  }

  SelectTab(impl) {
    if (this.selected_tab !== null) {
      this.selected_tab._titlenode.classList.remove('selected');
      this.StopMediaContent(this.selected_tab._contentnode);
      this.content.appendChild(this.selected_tab._contentnode);
    }

    this.selected_tab = impl;
    this.selected_tab._titlenode.classList.add('selected');
    this.renderframe.appendChild(this.selected_tab._contentnode);
  }
});