// task-controller.js

import {renderElement, RenderPosition, replace, remove} from '../utils.js';
import TaskComponent from '../components/task.js';
import TaskPopupComponent from '../components/task-edit.js';
import {TaskObject as Task, parseFormData} from '../data.js';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class TaskController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._taskComponent = null;
    this._taskEditComponent = null;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._mode = Mode.DEFAULT;
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._viewChangeHandler();
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._dataChangeHandler(this, Task.empty(), null);
      }
      this._taskEditComponent.reset();
      this._replaceEditToTask();
    }
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskPopupComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      const newTask = Task.clone(task);
      newTask.isFavorite = !newTask.isFavorite;
      this._dataChangeHandler(this, task, newTask);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      const newTask = Task.clone(task);
      newTask.isArchive = !newTask.isArchive;
      this._dataChangeHandler(this, task, newTask);
    });

    this._taskEditComponent.setSubmitHandler(() => {
      const formData = new FormData(this._taskEditComponent.getElement().querySelector(`.card__form`));
      const data = parseFormData(formData);
      data.id = task.id;
      // eslint-disable-next-line camelcase
      data.is_favorite = task.isFavorite;
      // eslint-disable-next-line camelcase
      data.is_archived = task.isArchive;
      const newTask = Task.parse(data);
      if (this._mode === Mode.ADDING) {
        this._dataChangeHandler(this, null, newTask);
      } else {
        newTask.id = task.id;
        this._dataChangeHandler(this, task, newTask);
      }
      this._replaceEditToTask();
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => {
      this._dataChangeHandler(this, task, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          renderElement(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._escKeyDownHandler);
        renderElement(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._taskEditComponent.reset();
      this._replaceEditToTask();
    }
  }
}
