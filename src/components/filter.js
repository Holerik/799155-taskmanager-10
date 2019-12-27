// filter.js

import AbstractComponent from './abstract.js';
import {createElement} from '../utils.js';

export const FilterType = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  TAGS: `tags`,
  ARCHIVE: `archive`
};

const getFilterTemplate = (filter) => {
  const section =
  `    <input
    type="radio"
    id="filter__${filter.title}"
    class="filter__input visually-hidden}"
    name="filter"
    ${filter.isChecked ? `checked` : ``}
    disabled
    />
    <label for="filter__${filter.title}" class="filter__label">
    ${filter.title} <span class="filter__${filter.title}-count">${filter.count}</span></label>`;
  return section;
};


const createFiltersTemplate = (filtersArray) => {
  let filterTemplate = `      <section class="main__filter filter container">`;
  filterTemplate += filtersArray.map((filter) => getFilterTemplate(filter)).join(`\n`);
  return filterTemplate + `</section>`;
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._currentFilterType = FilterType.ALL;
    this._filterTypeChangeHandler = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterTypeChangeHandler(handler) {
    this._filterTypeChangeHandler = handler;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._element.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (evt.target.tagName !== `INPUT`) {
          return;
        }
        const title = evt.target.textContent;
        const values = Object.values(FilterType);
        const filterType = values[values.indexOf((value) => title.indexOf(value) > -1)];
        if (this._currentFilterType === filterType) {
          return;
        }
        this._currentFilterType = filterType;
        if (this._filterTypeChangeHandler) {
          this._filterTypeChangeHandler(filterType);
        }
      });
    }
    return this._element;
  }
}
