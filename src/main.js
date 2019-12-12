// main.js

import {taskObjectsArray, TASKS_PER_PAGE} from './data.js';
import {renderElement, RenderPosition} from './utils.js';
import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import TaskComponent from './components/task.js';
import TaskPopupComponent from './components/task-edit.js';
import SiteMenuComponent from './components/site-menu.js';
import MoreButtonComponent from './components/more-button.js';
import NoTasksComponent from './components/no-tasks.js';

let tasksCount = taskObjectsArray.length;
let tasksRenderArray = [];
let repeatButton = null;
let lastRenderedTask = tasksCount > TASKS_PER_PAGE ? TASKS_PER_PAGE : tasksCount;
const isAllTasksArchived = taskObjectsArray.every((task) => task.isArchive);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderElement(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new FilterComponent().getElement(), RenderPosition.BEFOREEND);
const boardComponent = new BoardComponent();
renderElement(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

const ajustTasksRenderArray = () => {
  let tasksArray = taskObjectsArray.slice(0, lastRenderedTask);
  return tasksArray;
};

const renderTask = (task) => {
  const taskComponent = new TaskComponent(task);
  const taskPopupComponent = new TaskPopupComponent(task);
  renderElement(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskPopupComponent.getElement());
  };

  const escKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      repeatButton.removeEventListener(`click`, repeatButtonClickHandler);
      replaceEditToTask();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    taskListElement.replaceChild(taskPopupComponent.getElement(), taskComponent.getElement());
    document.addEventListener(`keydown`, escKeyDownHandler);
    repeatButton = taskPopupComponent.getElement().querySelector(`.card__repeat-toggle`);
    repeatButton.addEventListener(`click`, repeatButtonClickHandler);
  });

  const editForm = taskPopupComponent.getElement().querySelector(`.card__form`);
  editForm.addEventListener(`submit`, () => {
    repeatButton.removeEventListener(`click`, repeatButtonClickHandler);
    replaceEditToTask();
  });
};

const removeTasks = () => {
  if (repeatButton) {
    repeatButton.removeEventListener(`click`, repeatButtonClickHandler);
  }
  let card = taskListElement.querySelector(`.card__edit`);
  if (card) {
    taskListElement.removeChild(card);
  }
  while (taskListElement) {
    card = taskListElement.querySelector(`.card`);
    if (card) {
      taskListElement.removeChild(card);
    } else {
      break;
    }
  }
};

const removeMoreButton = () => {
  moreButton.getElement().removeEventListener(`click`, () => {
    renderTaskElements(TASKS_PER_PAGE);
  });
  moreButton.getElement().remove();
  moreButton.removeElement();
};

const repeatButtonClickHandler = () => {
  changeRepeatStatus(repeatButton);
};

const renderTaskElements = (delta = 0) => {
  lastRenderedTask += delta;
  if (lastRenderedTask > tasksCount) {
    lastRenderedTask = tasksCount;
  }
  removeTasks();
  tasksRenderArray = ajustTasksRenderArray();
  for (let task of tasksRenderArray) {
    renderTask(task);
  }

  if (tasksCount === lastRenderedTask) {
    removeMoreButton();
  }
};

if (isAllTasksArchived) {
  renderElement(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  renderTaskElements();
}

const moreButton = new MoreButtonComponent();
renderElement(boardComponent.getElement(), moreButton.getElement(), RenderPosition.BEFOREEND);

const changeRepeatStatus = (button) => {
  const editCard = taskListElement.querySelector(`.card__edit`);
  const element = button.querySelector(`.card__repeat-status`);
  const cardDate = taskListElement.querySelector(`.card__date-deadline`);
  const cardRepeatDays = taskListElement.querySelector(`.card__repeat-days`);
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

if (tasksCount < TASKS_PER_PAGE) {
  removeMoreButton();
}

moreButton.getElement().addEventListener(`click`, () => {
  renderTaskElements(TASKS_PER_PAGE);
});
