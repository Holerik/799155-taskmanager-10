// board.js

import AbstractComponent from './abstract.js';

const createBoardTemplate = (sortComponent) => {
  return (
    `      <section class="board container">
${sortComponent.getTemplate()}
        <div class="board__tasks">
        </div>
      </section>`
  );
};

export default class Board extends AbstractComponent {
  constructor(sortComponent) {
    super();
    this._sortComponent = sortComponent;
  }

  getTemplate() {
    return createBoardTemplate(this._sortComponent);
  }
}
