import {filtersArray} from '../data.js';

const getSectionTemplate = (filter) => {
  const section =
  `    <input
    type="radio"
    id="filter__${filter.title}"
    class="filter__input visually-hidden}"
    name="filter"
    checked
    disabled
    />
    <label for="filter__all" class="filter__label">
    ${filter.title} <span class="filter__${filter.title}-count">${filter.count}</span></label>`;
  return section;
};

export const createFilterTemplate = () => {
  let filterTemplate = `      <section class="main__filter filter container">`;
  for (let filter of filtersArray) {
    const section = getSectionTemplate(filter);
    filterTemplate += section;
  }
  return filterTemplate + `</section>`;
};
