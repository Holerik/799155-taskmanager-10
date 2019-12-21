// main.js

import {taskObjectsArray} from './data.js';
import {renderElement, RenderPosition} from './utils.js';
import BoardController from './controllers/board-controller.js';
import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import SiteMenuComponent from './components/site-menu.js';
import {SortComponent} from './components/sort.js';

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderElement(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new FilterComponent(), RenderPosition.BEFOREEND);
const sortComponent = new SortComponent();
const container = new BoardComponent();
renderElement(siteMainElement, container, RenderPosition.BEFOREEND);
renderElement(container.getElement(), sortComponent, RenderPosition.AFTERBEGIN);
const boardController = new BoardController(container, sortComponent, taskObjectsArray);

boardController.render();
