/* eslint-disable camelcase */
// data.js

import {FilterType} from './components/filter.js';
import {isOneDay, isOverdueDate} from './date.js';

export const months = [`Января`, `Февраля`, `Марта`, `Апреля`, `Мая`, `Июня`, `Июля`, `Августа`,
  `Сентября`, `Октября`, `Ноября`, `Декабря`];

export const getMinutes = (date) => {
  const min = date.getMinutes();
  const minutes = `${min > 9 ? `` : `0`}` + min;
  return minutes;
};

export const COLOR = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`,
};

export const dateFormatter = {
  compare(date) {
    return Date.parse(this.dateToISO(date)) > Date.parse(this.dateToISO(Date.now()));
  },
  dateToISO(date = Date.now()) {
    return new Date(date).toISOString().substr(0, 10);
  },
  lastDay() {
    const date = new Date();
    return this.dateToISO(date.setDate(date.getDate() - 1));
  },
  dateLocal(date) {
    return date ? date.split(`-`).reverse().join(`.`) : ``;
  },
  dateCustom(date) {
    const d = new Date(date);
    function pad(n) {
      return n < 10 ? `0` + n : n;
    }
    return pad(d.getDate()) + `.` + pad(d.getMonth() + 1) + `.` + d.getFullYear();
  }
};


const EmptyTask = {
  description: ``,
  due_date: (new Date()).toISOString(),
  repeating_days: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  tags: [],
  color: COLOR.BLACK,
  is_favorite: false,
  is_archived: false,
};

export class TaskObject {
  constructor(data) {
    if (data.id === undefined) {
      this.id = -1;
    } else {
      this.id = data[`id`];
    }
    this.description = data[`description`];
    this.dueDate = new Date(data[`due_date`]);
    this.repeatingDays = data[`repeating_days`];
    this.tags = new Set(data[`tags`]);
    this.color = data[`color`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.isArchive = Boolean(data[`is_archived`]);
  }

  static parse(data) {
    return new TaskObject(data);
  }

  static empty() {
    return new TaskObject(EmptyTask);
  }

  static clone(task) {
    return new TaskObject(task.raw());
  }

  raw() {
    return {
      'id': this.id,
      'description': this.description,
      'due_date': this.dueDate.toISOString(),
      'tags': Array.from(this.tags),
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_archived': this.isArchive,
    };
  }
}

export const TASKS_PER_PAGE = 8;

const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

const getTasksWithHashtags = (tasks) => {
  return tasks.filter((task) => task.tags.size);
};

const getTasksInOneDay = (tasks, date) => {
  return tasks.filter((task) => isOneDay(task.dueDate, date));
};

export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveTasks(tasks); // Array.from(tasks);
    case FilterType.ARCHIVE:
      return getArchiveTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks), nowDate);
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));
    case FilterType.TAGS:
      return getTasksWithHashtags(getNotArchiveTasks(tasks));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks), nowDate);
  }

  return tasks;
};

export class FilterObject {
  constructor(title) {
    this.title = title;
    this.isChecked = false;
    this.count = 0;
  }
}

export const parseFormData = (formData) => {
  const repeatingDays = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`].reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});
  const date = formData.get(`date`);
  return {
    description: formData.get(`text`),
    color: formData.get(`color`),
    tags: formData.getAll(`hashtag`),
    due_date: date ? new Date(date) : new Date(),
    repeating_days: formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays)
  };
};

export class Model {
  constructor() {
    this._tasks = [];
    this._currentFilterType = FilterType.ALL;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getTasks() {
    return getTasksByFilter(this._tasks, this._currentFilterType);
  }

  getTasksAll() {
    return this._tasks;
  }

  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterType(filterType) {
    this._currentFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateTask(oldTask, newTask) {
    const index = this._tasks.findIndex((task) => task.id === oldTask.id);
    if (index === -1) {
      return false;
    }
    this._tasks = [].concat(this._tasks.slice(0, index), newTask, this._tasks.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  removeTask(id) {
    const index = this._tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      return false;
    }
    this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  addTask(newTask) {
    if (newTask.id === -1) {
      let maxId = 0;
      this._tasks.forEach((task) => {
        maxId = Math.max(maxId, task.id);
      });
      newTask.id = maxId + 1;
    }
    this._tasks = [].concat(newTask, this._tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
