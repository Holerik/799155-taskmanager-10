// board-controller.js

import NoTasksComponent from '../components/no-tasks.js';
import {SortType} from '../components/sort.js';
import MoreButtonComponent from '../components/more-button.js';
import {renderElement, RenderPosition, remove} from '../utils.js';
import {TASKS_PER_PAGE, TaskObject as Task} from '../data.js';
import TaskController, {Mode} from '../controllers/task-controller';
import {FilterType} from '../components/filter.js';

export default class BoardController {
  constructor(api, model, container, sortComponent) {
    this._api = api;
    this._tasks = model;
    this._container = container;
    this._sortComponent = sortComponent;
    this._moreButtonComponent = new MoreButtonComponent();
    this._lastRenderedTask = 0;
    this._currentLastRenderedTask = 0;
    this._taskListElement = this._container.getElement().querySelector(`.board__tasks`);
    this._sortComponent.setSortTypeChangeHandler(this._renderTaskElements.bind(this));
    this._showedTaskControllers = [];
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._moreButtonComponent.setClickHandler((evt) => {
      evt.preventDefault();
      this._renderTaskElements(TASKS_PER_PAGE);
    });
    this._createdTaskController = null;
    this._currentFilterType = FilterType.ALL;
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._tasks.setFilterChangeHandler(this._filterChangeHandler);
  }

  setFilterType(filter) {
    if (filter === this._currentFilterType) {
      return;
    }
    this._tasks.setFilterType(filter);
    this._currentFilterType = filter;
  }

  createTask() {
    if (this._createdTaskController) {
      return false;
    }
    const newTask = Task.empty();
    this._viewChangeHandler();
    this._createdTaskController = new TaskController(this._taskListElement, this._dataChangeHandler, this._viewChangeHandler);
    this._createdTaskController.render(newTask, Mode.ADDING);
    this._showedTaskControllers.unshift(this._createdTaskController);
    return true;
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _ajustTasksRenderArray() {
    let tasksByFilter = this._tasks.getTasks();
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

  _removeAddedTask() {
    if (this._createdTaskController !== null) {
      this._showedTaskControllers.shift();
      this._createdTaskController.destroy();
      this._createdTaskController = null;
    }
  }

  _dataChangeHandler(taskController, oldTask, newTask) {
    if (newTask === null) { // удаляем контроллер
      if (this._createdTaskController !== null) {
        this._removeAddedTask();
        this._renderTaskElements();
      } else {
        // пробуем удалить на сервере
        taskController.disableButtons(true);
        this._api.deleteTask(oldTask.id)
        .then(() => {
          // удаляем из модели
          this._tasks.removeTask(oldTask.id);
          this._renderTaskElements();
        })
        .catch(() => {
          taskController.shake();
        });
      }
    } else if (oldTask === null) {
      this._createdTaskController = null;
      // пробуем добавить на сервере
      taskController.disableButtons(true);
      this._api.createTask(newTask)
      .then((task) => {
        // добавляем в модель
        this._tasks.addTask(task);
        this._renderTaskElements();
      })
      .catch(() => {
        taskController.disableButtons(false);
        taskController.enableRedShadow(true);
        taskController.shake();
      });
    } else {
      // обновляем на сервере
      taskController.disableButtons(true);
      this._api.updateTask(oldTask.id, newTask)
      .then((updTask) => { // обновляем task в модели
        this._tasks.updateTask(oldTask, updTask);
        this._renderTaskElements();
      })
      .catch(() => {
        taskController.disableButtons(false);
        taskController.enableRedShadow(true);
        taskController.shake();
      });
    }
  }

  _viewChangeHandler() {
    this._showedTaskControllers.forEach((taskController) => taskController.setDefaultView());
  }

  _renderTaskElements(tasksPerPage = 0) {
    this._removeTasks();

    this._lastRenderedTask += tasksPerPage;
    this._currentLastRenderedTask = this._lastRenderedTask;
    let tasksRenderArray = this._ajustTasksRenderArray();
    let length = tasksRenderArray.length;
    if (this._currentLastRenderedTask > length) {
      this._currentLastRenderedTask = length;
    }

    tasksRenderArray.slice(0, this._currentLastRenderedTask).forEach((task) => {
      const taskController = new TaskController(this._taskListElement, this._dataChangeHandler, this._viewChangeHandler);
      taskController.render(task, Mode.DEFAULT);
      this._showedTaskControllers.push(taskController);
    });

    length = this._showedTaskControllers.length;
    if (tasksRenderArray.length === this._currentLastRenderedTask) {
      this._removeMoreButton();
    }
  }

  _filterChangeHandler() {
    this._renderTaskElements();
  }

  // рисуем содержимое контроллера
  render() {
    const isAllTasksArchived = this._tasks.getTasksAll().every((task) => task.isArchive);
    if (isAllTasksArchived || (this._tasks.getTasksAll().length === 0)) {
      renderElement(this._container.getElement(), new NoTasksComponent(), RenderPosition.BEFOREEND);
    } else {
      renderElement(this._container.getElement(), this._moreButtonComponent, RenderPosition.BEFOREEND);
      this._renderTaskElements(TASKS_PER_PAGE);
    }
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
    this._viewChangeHandler();
    this._removeAddedTask();
    this._renderTaskElements();
  }
}
