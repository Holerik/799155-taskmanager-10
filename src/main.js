import {renderTemplate} from './components/render-template.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createTaskTemplate} from './components/task.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createLoadMoreButtonTemplate} from './components/more-button.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';

const TASK_COUNT = 3;


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderTemplate(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
renderTemplate(siteMainElement, createFilterTemplate(), `beforeend`);
renderTemplate(siteMainElement, createBoardTemplate(), `beforeend`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
renderTemplate(taskListElement, createTaskEditTemplate(), `beforeend`);

new Array(TASK_COUNT)
  .fill(``)
  .forEach(
      () => renderTemplate(taskListElement, createTaskTemplate(), `beforeend`)
  );

const boardElement = siteMainElement.querySelector(`.board`);
renderTemplate(boardElement, createLoadMoreButtonTemplate(), `beforeend`);
