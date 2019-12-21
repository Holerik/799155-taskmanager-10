// sort.js

import {createElement} from '../utils.js';
import AbstractComponent from './abstract.js';

export const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`
};

const createSortTemplate = () => {
  return (
    `        <div class="board__filter-list">
          <a href="#" data-sort-type= "${SortType.DEFAULT}" class="board__filter">SORT BY DEFAULT</a>
          <a href="#" data-sort-type= "${SortType.DATE_UP}" class="board__filter">SORT BY DATE up</a>
          <a href="#" data-sort-type= "${SortType.DATE_DOWN}" class="board__filter">SORT BY DATE down</a>
        </div>`
  );
};

export class SortComponent extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
    this._sortTypeChangeHandler = null;
  }

  getTemplate() {
    return createSortTemplate();
  }

  get currentSortType() {
    return this._currentSortType;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._element.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (evt.target.tagName !== `A`) {
          return;
        }
        const sortType = evt.target.dataset.sortType;
        if (this._currentSortType === sortType) {
          return;
        }
        this._currentSortType = sortType;
        if (this._sortTypeChangeHandler) {
          this._sortTypeChangeHandler();
        }
      });
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  setSortTypeChangeHandler(handler) {
    this._sortTypeChangeHandler = handler;
  }
}

