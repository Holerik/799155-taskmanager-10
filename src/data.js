// data.js

import {FilterType} from './components/filter.js';
import moment from 'moment';

export const months = [`Января`, `Февраля`, `Марта`, `Апреля`, `Мая`, `Июня`, `Июля`, `Августа`,
  `Сентября`, `Октября`, `Ноября`, `Декабря`];

export const getMinutes = (date) => {
  const min = date.getMinutes();
  const minutes = `${min > 9 ? `` : `0`}` + min;
  return minutes;
};

const taskDescriptions = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];

const getRandomTaskDescription = () => {
  return taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)];
};

const tagsList = [`homework`, `theory`, `practice`, `intensive`, `keks`, `frontend`];

const getRandomTag = () => {
  return tagsList[Math.floor(Math.random() * tagsList.length)];
};

const getRandomTagsList = (listSize) => {
  let list = new Set();
  while (list.size < listSize) {
    const randomTag = getRandomTag();
    list.add(randomTag);
  }
  if (listSize === 0) {
    list.add(``);
  }
  return list;
};

export const COLOR = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`,
};

const getRandomCardColor = () => {
  const colors = Object.values(COLOR);
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hours = date.getHours();
  let delta = Math.floor(Math.random() * 7);
  if (delta > 3) {
    day += delta;
  } else {
    day -= delta;
  }
  date = new Date(year, month, day, hours);
  return date;
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

const getRandomBolean = () => {
  return Math.floor(Math.random() * 2) > 0;
};

const EmptyTask = {
  description: ``,
  dueDate: new Date(),
  repeatingDays: {
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
  isFavorite: false,
  isArchive: false,
};

export class TaskObject {
  constructor(index) {
    this.id = index;
    this.description = getRandomTaskDescription();
    this.dueDate = getRandomDate();
    this.repeatingDays = {
      'mo': false,
      'tu': false,
      'we': false,
      'th': false,
      'fr': getRandomBolean(),
      'sa': false,
      'su': false
    };
    this.tags = getRandomTagsList(Math.floor(Math.random() * 3));
    this.color = getRandomCardColor();
    this.isFavorite = getRandomBolean();
    this.isArchive = getRandomBolean();
  }

  static empty() {
    return this.clone(EmptyTask);
  }

  static clone(data) {
    const task = new TaskObject();
    if (data.id === undefined) {
      task.id = -1;
    } else {
      task.id = data[`id`];
    }
    task.description = data[`description`];
    task.dueDate = data[`dueDate`];
    task.repeatingDays = data[`repeatingDays`];
    task.tags = new Set(data[`tags`]);
    task.color = data[`color`];
    task.isFavorite = Boolean(data[`isFavorite`]);
    task.isArchive = Boolean(data[`isArchive`]);
    return task;
  }
}

export const taskObjectsArray = [];

export const filtersArray = [];

const TASKS_COUNT = 12;

export const TASKS_PER_PAGE = 8;

for (let i = 0; i < TASKS_COUNT; i++) {
  taskObjectsArray.push(new TaskObject(i));
}

const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

const isOneDay = (date1, date2) => {
  const d1 = moment(date1);
  const d2 = moment(date2);
  return d1.diff(d2, `days`) === 0 && date1.getDate() === date2.getDate();
};

const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(dueDate, date);
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
    this.count = getTasksByFilter(taskObjectsArray, title).length;
  }
}

for (let title of Object.values(FilterType)) {
  const filter = new FilterObject(title);
  filtersArray.push(filter);
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
    dueDate: date ? new Date(date) : new Date(),
    repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
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
