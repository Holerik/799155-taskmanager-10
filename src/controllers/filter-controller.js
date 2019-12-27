// filter-controller.js

import FilterComponent, {FilterType} from '../components/filter.js';
import {renderElement, RenderPosition, replace} from '../utils.js';
import {getTasksByFilter, taskObjectsArray} from '../data.js';

export default class FilterController {
  constructor(container, boardController) {
    this._container = container;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._changeFilterType = this._changeFilterType.bind(this);
    this._boardController = boardController;
  }

  _changeFilterType(filter) {
    this._boardController.setFilter(filter);
    this._activeFilterType = filter;
    this._render();
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        count: getTasksByFilter(taskObjectsArray, filterType).length,
        isChecked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterTypeChangeHandler(this._changeFilterType);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      renderElement(this._container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }
}
