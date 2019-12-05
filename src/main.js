import {taskObjectsArray, TASK_PER_PAGE, tasksRenderConfig} from './data.js';
import {renderTemplate} from './utils.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createTaskTemplate} from './components/task.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createLoadMoreButtonTemplate} from './components/more-button.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';

let taskCount = taskObjectsArray.length;
let tasksRenderArray = [];
let columnsCount = 0;
let repeatButton = null;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderTemplate(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
renderTemplate(siteMainElement, createFilterTemplate(), `beforeend`);
renderTemplate(siteMainElement, createBoardTemplate(), `beforeend`);
const taskListElement = siteMainElement.querySelector(`.board__tasks`);

const ajustTasksRenderArray = () => {
  const first = tasksRenderConfig.firstTaskNumber;
  const last = tasksRenderConfig.lastTaskNumber;
  let tasksArray = taskObjectsArray.slice(first, last);
  return tasksArray;
};

const removeTasks = () => {
  if (repeatButton) {
    repeatButton.removeEventListener(`click`, repeatButtonClickHandler);
  }
  let card = taskListElement.querySelector(`.card__edit`);
  if (card) {
    taskListElement.removeChild(card);
  }
  card = taskListElement.querySelector(`.card__shift`);
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

const repeatButtonClickHandler = () => {
  changeRepeatStatus(repeatButton);
};

const renderTaskElements = (delta) => {
  tasksRenderConfig.lastTaskNumber += delta;
  if (tasksRenderConfig.lastTaskNumber > taskCount) {
    tasksRenderConfig.lastTaskNumber = taskCount;
  }
  removeTasks();
  tasksRenderArray = ajustTasksRenderArray();
  columnsCount = Math.floor(document.body.clientWidth / 250);
  tasksRenderArray[columnsCount - 1].leftMargin = true;
  renderTemplate(taskListElement, createTaskEditTemplate(tasksRenderArray[0]), `beforeend`);
  for (let task of tasksRenderArray) {
    renderTemplate(taskListElement, createTaskTemplate(task), `beforeend`);
  }
  repeatButton = document.querySelector(`.card__repeat-toggle`);
  repeatButton.addEventListener(`click`, repeatButtonClickHandler);

  if (taskCount - delta < TASK_PER_PAGE) {
    moreButton.classList.add(`visually-hidden`);
  }
};

renderTaskElements(0);

const boardElement = siteMainElement.querySelector(`.board`);
renderTemplate(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

const moreButton = document.querySelector(`.load-more`);

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

if (taskCount < TASK_PER_PAGE) {
  moreButton.classList.add(`visually-hidden`);
}

moreButton.addEventListener(`click`, () => {
  renderTaskElements(TASK_PER_PAGE);
});
