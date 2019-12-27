// board-controller.js

import NoTasksComponent from '../components/no-tasks.js';
import {SortType} from '../components/sort.js';
import MoreButtonComponent from '../components/more-button.js';
import {renderElement, RenderPosition, remove} from '../utils.js';
import {TASKS_PER_PAGE, tasksModel} from '../data.js';
import TaskController, {Mode} from '../controllers/task-controller';
import {FilterType} from '../components/filter.js';

export default class BoardController {
  constructor(container, sortComponent) {
    this._container = container;
    this._sortComponent = sortComponent;
    this._moreButtonComponent = new MoreButtonComponent();
    this._lastRenderedTask = 0;
    this._taskListElement = this._container.getElement().querySelector(`.board__tasks`);
    this._sortComponent.setSortTypeChangeHandler(this._renderTaskElements.bind(this));
    this._showedTaskControllers = [];
    this._changeData = this._changeData.bind(this);
    this._changeView = this._changeView.bind(this);
    this._moreButtonComponent.setClickHandler((evt) => {
      evt.preventDefault();
      this._renderTaskElements(TASKS_PER_PAGE);
    });
    this._createdTaskController = null;
    this._currentFilterType = FilterType.ALL;
  }

  setFilterType(filter) {
    if (filter === this._currentFilterType) {
      return;
    }
    this._currentFilterType = filter;
    this._renderTaskElements();
  }

  createTaskController() {
    if (this._createdTaskController) {
      return;
    }
    this._createdTaskController = new TaskController(this._taskListElement, this._changeData, this._changeView);
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _ajustTasksRenderArray() {
    tasksModel.setFilterType(this._currentFilterType);
    let tasksByFilter = tasksModel.getTasks();
    let sortedTasks = [];
    switch (this._sortComponent.currentSortType) {
      case SortType.DEFAULT:
        sortedTasks = tasksByFilter;
        break;
      case SortType.DATE_UP:
        sortedTasks = tasksByFilter.slice().
        sort((left, right) => left.dueDate - right.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = tasksByFilter.slice().
        sort((left, right) => right.dueDate - left.dueDate);
        break;
    }
    return sortedTasks;
  }

  _removeMoreButton() {
    this._moreButtonComponent.removeClickHandle();
    remove(this._moreButtonComponent);
  }

  _changeData(taskController, oldTask, newTask) {
    tasksModel.updateTask(oldTask, newTask);
    taskController.render(newTask, Mode.DEFAULT);
  }

  _changeView() {
    this._showedTaskControllers.forEach((taskController) => taskController.setDefaultView());
  }

  _renderTaskElements(tasksPerPage = 0) {
    this._removeTasks();

    this._lastRenderedTask += tasksPerPage;
    let tasksRenderArray = this._ajustTasksRenderArray();
    let length = tasksRenderArray.length;
    if (this._lastRenderedTask > length) {
      this._lastRenderedTask = length;
    }

    tasksRenderArray.slice(0, this._lastRenderedTask).forEach((task) => {
      const taskController = new TaskController(this._taskListElement, this._changeData, this._changeView);
      taskController.render(task, Mode.DEFAULT);
      this._showedTaskControllers.push(taskController);
    });

    length = this._showedTaskControllers.length;
    if (tasksRenderArray.length === this._lastRenderedTask) {
      this._removeMoreButton();
    }
  }

  // рисуем содержимое контроллера
  render() {
    const isAllTasksArchived = tasksModel.getTasksAll().every((task) => task.isArchive);
    if (isAllTasksArchived || (tasksModel.getTasksAll().length === 0)) {
      renderElement(this._container.getElement(), new NoTasksComponent(), RenderPosition.BEFOREEND);
    } else {
      this._renderTaskElements(TASKS_PER_PAGE);
      renderElement(this._container.getElement(), this._moreButtonComponent, RenderPosition.BEFOREEND);
    }
  }
}
