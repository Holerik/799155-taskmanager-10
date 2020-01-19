// main.js

import Api, {errorHandle} from './api.js';
import {renderElement, RenderPosition} from './utils.js';
import BoardController from './controllers/board-controller.js';
import BoardComponent from './components/board.js';
import FilterController from './controllers/filter-controller.js';
import SiteMenuComponent, {SiteMenuItems} from './components/site-menu.js';
import SortComponent from './components/sort.js';
import {Model} from './data.js';
import StatisticsComponenet from './components/statistics.js';

export const tasksModel = new Model();

const DAYS_BACK_COUNT = 7;
const AUTHORIZATION = `Basic sE417MA27101958`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/task-manager/`;

const api = new Api(END_POINT, AUTHORIZATION);

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - DAYS_BACK_COUNT);
  return d;
})();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();
renderElement(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
const statistics = new StatisticsComponenet(tasksModel, dateFrom, dateTo);
const sortComponent = new SortComponent();
const container = new BoardComponent();
const boardController = new BoardController(api, tasksModel, container, sortComponent);
const filterController = new FilterController(tasksModel, siteMainElement, boardController);
filterController.render();
renderElement(siteMainElement, container, RenderPosition.BEFOREEND);
renderElement(container.getElement(), sortComponent, RenderPosition.AFTERBEGIN);
renderElement(siteMainElement, statistics, RenderPosition.BEFOREEND);

const siteMenuChangeHandler = (menuItem) => {
  switch (menuItem) {
    case SiteMenuItems.TASKS:
      statistics.hide();
      boardController.show();
      break;
    case SiteMenuItems.ADD:
      statistics.hide();
      boardController.show();
      boardController.createTask();
      break;
    case SiteMenuItems.STATISTICS:
      boardController.hide();
      statistics.show();
      break;
  }
};

siteMenuComponent.setSiteMenuChangeHandler(siteMenuChangeHandler);
statistics.hide();

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  })
  .catch(errorHandle);
