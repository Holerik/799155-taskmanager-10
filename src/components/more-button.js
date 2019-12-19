// more-button.js

import AbstractComponent from './abstract.js';

const createLoadMoreButtonTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoarMoreButton extends AbstractComponent {
  constructor() {
    super();
    this._clickHandler = null;
  }

  getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
    this._clickHandler = handler;
  }

  removeClickHandle() {
    if (this._clickHandler) {
      this.getElement().removeEventListener(`click`, this._clickHandler);
      this._clickHandler = null;
    }
  }
}

