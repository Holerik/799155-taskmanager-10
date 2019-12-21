// filter.js

import {filtersArray} from '../data.js';
import AbstractComponent from './abstract.js';

const getFilterTemplate = (filter, isChecked) => {
  const section =
  `    <input
    type="radio"
    id="filter__${filter.title}"
    class="filter__input visually-hidden}"
    name="filter"
    ${isChecked ? `checked` : ``}
    disabled
    />
    <label for="filter__all" class="filter__label">
    ${filter.title} <span class="filter__${filter.title}-count">${filter.count}</span></label>`;
  return section;
};


const createFiltersTemplate = () => {
  let filterTemplate = `      <section class="main__filter filter container">`;
  filterTemplate += filtersArray.map((filter, index) => getFilterTemplate(filter, index === 0)).join(`\n`);
  return filterTemplate + `</section>`;
};

export default class Filter extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createFiltersTemplate();
  }
}
