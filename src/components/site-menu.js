// site-menu.js

import AbstractComponent from './abstract.js';
import {createElement} from '../utils.js';

export const SiteMenuItems = {
  ADD: `+ add new task`,
  TASKS: `tasks`,
  SATATISTICS: `statistics`
};

const createSiteMenuTemplate = () => {
  return (
    `        <section class="control__btn-wrap">
          <input
            type="radio"
            name="control"
            id="control__new-task"
            class="control__input visually-hidden"
          />
          <label for="control__new-task" class="control__label control__label--new-task"
            >+ ADD NEW TASK</label
          >
          <input
            type="radio"
            name="control"
            id="control__task"
            class="control__input visually-hidden"
            checked
          />
          <label for="control__task" class="control__label">TASKS</label>
          <input
            type="radio"
            name="control"
            id="control__statistic"
            class="control__input visually-hidden"
          />
          <label for="control__statistic" class="control__label"
            >STATISTICS</label
          >
        </section>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor() {
    super();
    this._siteMenuClickHandle = this._siteMenuClickHandle.bind(this);
    this._currentSiteMenuItem = SiteMenuItems.TASKS;
    this._siteMenuChangeHandler = null;
    this.setSiteMenuChangeHandler = this.setSiteMenuChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _siteMenuClickHandle(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    const menuItem = evt.target.firstChild.nodeValue;
    const items = Object.values(SiteMenuItems);
    this._currentSiteMenuItem = items[items.findIndex((item) => menuItem.toLowerCase().indexOf(item) > -1)];
    if (this._siteMenuChangeHandler) {
      this._siteMenuChangeHandler(this._currentSiteMenuItem);
    }
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._element.addEventListener(`click`, this._siteMenuClickHandle);
    }
    return this._element;
  }

  setSiteMenuChangeHandler(handler) {
    this._siteMenuChangeHandler = handler;
  }
}
