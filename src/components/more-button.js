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
  }

  getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}

