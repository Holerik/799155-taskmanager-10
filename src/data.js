// data.js

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

const cardColors = [`black`, `yellow`, `blue`, `green`, `pink`];
const getRandomCardColor = () => {
  return cardColors[Math.floor(Math.random() * cardColors.length)];
};

const getRandomDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hours = date.getHours();// Math.floor(Math.random() * 23);
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

export class TaskObject {
  constructor() {
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
    this.leftMargin = false;
  }
}

export const taskObjectsArray = [];

export const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];

const getCount = (fn) => {
  let count = 0;
  for (let task of taskObjectsArray) {
    if (fn(task)) {
      count++;
    }
  }
  return count;
};

const getCountOfTasksByFilter = (title) => {
  let count = 0;
  switch (title) {
    case filterNames[0]:
      count = taskObjectsArray.length;
      break;
    case filterNames[5]:
      count = getCount((task) => {
        return task.tags.size > 0;
      });
      break;
    case filterNames[3]:
      count = getCount((task) => {
        return task.isFavorite;
      });
      break;
    case filterNames[6]:
      count = getCount((task) => {
        return task.isArchive;
      });
      break;
    case filterNames[2]:
      {
        const today = new Date();
        count = getCount((task) => {
          return today.getDay() === task.dueDate.getDay();
        });
      }
      break;
    case filterNames[1]:
      {
        const today = new Date();
        count = getCount((task) => {
          return today.getTime() > task.dueDate.getTime();
        });
      }
      break;
    case filterNames[4]:
      count = getCount((task) => {
        const values = Object.values(task.repeatingDays);
        return values.some((value) => {
          return value;
        });
      });
      break;
  }
  return count;
};

export const filtersArray = [];

export class FilterObject {
  constructor(title) {
    this.title = title;
    this.count = getCountOfTasksByFilter(title, taskObjectsArray);
  }
}

const TASKS_COUNT = 12;

export const TASKS_PER_PAGE = 8;

for (let i = 0; i < TASKS_COUNT; i++) {
  taskObjectsArray.push(new TaskObject());
}

for (let title of filterNames) {
  const filter = new FilterObject(title);
  filtersArray.push(filter);
}
