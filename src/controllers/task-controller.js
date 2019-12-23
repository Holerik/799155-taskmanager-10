// task-controller.js

export default class TaskController {
  constructor(taskComponent, taskEditComponent) {
    this._taskComponent = taskComponent;
    this._taskEditComponent = taskEditComponent;
  }

  destroy() {
    this._taskComponent.getElement().remove();
    this._taskComponent.removeElement();
    this._taskEditComponent.getElement().remove();
    this._taskEditComponent.removeElement();
  }
}
