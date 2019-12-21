// board-controller.js

import NoTasksComponent from '../components/no-tasks.js';
import {SortType} from '../components/sort.js';
import MoreButtonComponent from '../components/more-button.js';
import {renderElement, RenderPosition} from '../utils.js';
import {TASKS_PER_PAGE} from '../data.js';
import TaskComponent from '../components/task.js';
import TaskPopupComponent from '../components/task-edit.js';

export default class BoardController {
  constructor(container, sortComponent, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._sortComponent = sortComponent;
    this._moreButtonComponent = new MoreButtonComponent();
    this._lastRenderedTask = 0;
    this._taskListElement = this._container.getElement().querySelector(`.board__tasks`);
    this._sortComponent.setSortTypeChangeHandler(this.renderTaskElements.bind(this));
  }

  removeTasks() {
    let card = this._taskListElement.querySelector(`.card__edit`);
    if (card) {
      this._taskListElement.removeChild(card);
    }
    while (this._taskListElement) {
      card = this._taskListElement.querySelector(`.card`);
      if (card) {
        this._taskListElement.removeChild(card);
      } else {
        break;
      }
    }
  }

  ajustTasksRenderArray() {
    let sortedTasks = [];
    switch (this._sortComponent.currentSortType) {
      case SortType.DEFAULT:
        sortedTasks = this._tasks.slice(0, this._lastRenderedTask);
        break;
      case SortType.DATE_UP:
        sortedTasks = this._tasks.slice().
        sort((left, right) => left.dueDate - right.dueDate).slice(0, this._lastRenderedTask);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = this._tasks.slice().
        sort((left, right) => right.dueDate - left.dueDate).slice(0, this._lastRenderedTask);
        break;
    }
    return sortedTasks;
  }

  removeMoreButton() {
    this._moreButtonComponent.removeClickHandle();
    this._moreButtonComponent.getElement().remove();
    this._moreButtonComponent.removeElement();
  }

  renderTask(task) {
    const taskListElement = this._container.getElement().querySelector(`.board__tasks`);
    const taskComponent = new TaskComponent(task);
    const taskPopupComponent = new TaskPopupComponent(task);
    renderElement(taskListElement, taskComponent, RenderPosition.BEFOREEND);

    const repeatButtonClickHandler = () => {
      const editCard = this._taskListElement.querySelector(`.card__edit`);
      const element = editCard.querySelector(`.card__repeat-status`);
      const cardDate = editCard.querySelector(`.card__date-deadline`);
      const cardRepeatDays = this._taskListElement.querySelector(`.card__repeat-days`);
      let newText = ``;
      if (element.textContent.toLowerCase().indexOf(`yes`) > -1) {
        newText = `no`;
        cardDate.classList.remove(`visually-hidden`);
        cardRepeatDays.classList.add(`visually-hidden`);
        editCard.classList.remove(`card--repeat`);
      } else {
        newText = `yes`;
        cardDate.classList.add(`visually-hidden`);
        cardRepeatDays.classList.remove(`visually-hidden`);
        editCard.classList.add(`card--repeat`);
      }
      element.textContent = newText;
    };

    const replaceEditToTask = () => {
      taskListElement.replaceChild(taskComponent.getElement(), taskPopupComponent.getElement());
    };

    const escKeyDownHandler = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        taskPopupComponent.removeRepeatButtonClickHandler();
        replaceEditToTask();
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    taskComponent.setEditButtonClickHandler(() => {
      taskListElement.replaceChild(taskPopupComponent.getElement(), taskComponent.getElement());
      document.addEventListener(`keydown`, escKeyDownHandler);
      taskPopupComponent.setRepeatButtonClickHandler(repeatButtonClickHandler);
    });

    taskPopupComponent.setSubmitHandler(() => {
      replaceEditToTask();
    });
  }

  renderTaskElements(tasksPerPage = 0) {
    this._lastRenderedTask += tasksPerPage;
    if (this._lastRenderedTask > this._tasks.length) {
      this._lastRenderedTask = this._tasks.length;
    }
    this.removeTasks();
    let tasksRenderArray = this.ajustTasksRenderArray();
    for (let task of tasksRenderArray) {
      this.renderTask(task);
    }
    if (this._tasks.length === this._lastRenderedTask) {
      this.removeMoreButton();
    }
  }

  // рисуем содержимое контроллера
  render() {
    this._moreButtonComponent.setClickHandler(() => {
      this.renderTaskElements(TASKS_PER_PAGE);
    });
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);
    if (isAllTasksArchived || (this._tasks.length === 0)) {
      renderElement(this._container.getElement(), new NoTasksComponent(), RenderPosition.BEFOREEND);
    } else {
      this.renderTaskElements(TASKS_PER_PAGE);
      renderElement(this._container.getElement(), this._moreButtonComponent, RenderPosition.BEFOREEND);
    }
  }
}
