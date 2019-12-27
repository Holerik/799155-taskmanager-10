// main.js

import {renderElement, RenderPosition} from './utils.js';
import BoardController from './controllers/board-controller.js';
import BoardComponent from './components/board.js';
import FilterController from './controllers/filter-controller.js';
import SiteMenuComponent from './components/site-menu.js';
import SortComponent from './components/sort.js';


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
renderElement(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
const sortComponent = new SortComponent();
const container = new BoardComponent();
const boardController = new BoardController(container, sortComponent);
const filterController = new FilterController(siteMainElement, boardController);
filterController.render();
renderElement(siteMainElement, container, RenderPosition.BEFOREEND);
renderElement(container.getElement(), sortComponent, RenderPosition.AFTERBEGIN);
boardController.render();
