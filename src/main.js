// main.js

import {renderElement, RenderPosition} from './utils.js';
import BoardController from './controllers/board-controller.js';
import BoardComponent from './components/board.js';
import FilterController from './controllers/filter-controller.js';
import SiteMenuComponent from './components/site-menu.js';
import SortComponent from './components/sort.js';
import {Model, taskObjectsArray} from './data.js';

export const tasksModel = new Model();

tasksModel.setTasks(taskObjectsArray);


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();
renderElement(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
const sortComponent = new SortComponent();
const container = new BoardComponent();
const boardController = new BoardController(tasksModel, container, siteMenuComponent, sortComponent);
const filterController = new FilterController(tasksModel, siteMainElement, boardController);
filterController.render();
renderElement(siteMainElement, container, RenderPosition.BEFOREEND);
renderElement(container.getElement(), sortComponent, RenderPosition.AFTERBEGIN);
boardController.render();
