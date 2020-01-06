// filter-controller.js

import FilterComponent, {FilterType} from '../components/filter.js';
import {renderElement, RenderPosition, replace} from '../utils.js';
import {getTasksByFilter} from '../data.js';

export default class FilterController {
  constructor(tasks, container, boardController) {
    this._tasks = tasks;
    this._container = container;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._changeFilterTypeHandler = this._changeFilterTypeHandler.bind(this);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._boardController = boardController;
    tasks.setDataChangeHandler(this._dataChangeHandler);
  }

  _changeFilterTypeHandler(filter) {
    this._boardController.setFilterType(filter);
    this._activeFilterType = filter;
    this.render();
  }

  _dataChangeHandler() {
    this.render();
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      const taskCount = getTasksByFilter(this._tasks.getTasksAll(), filterType).length;
      return {
        title: filterType,
        isChecked: filterType === this._activeFilterType,
        count: taskCount,
        isDisabled: taskCount === 0,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterTypeChangeHandler(this._changeFilterTypeHandler);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      renderElement(this._container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }
}
