// no-task.js

import AbstractComponent from './abstract.js';

const createNoTasksTemplate = () => {
  return `<p class="board__no-tasks">
  Click &laquoADD NEW TASK&raquo in menu to create your first task</p>`;
};

export default class NoTasks extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createNoTasksTemplate();
  }
}
