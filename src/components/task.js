// task.js

import {months, getMinutes, dateFormatter} from '../data.js';
import {createElement} from '../utils.js';

const checkTaskIsDead = (task) => {
  // let currDate = new Date();
  // return currDate.getTime() > task.dueDate.getTime();
  return dateFormatter.compare(task.dueDate) === false;
};

const getTagTemplate = (tag) => {
  const template =
                       `<span class="card__hashtag-inner">
                          <span class="card__hashtag-name">
                            #${tag}
                          </span>
                        </span>`;
  return template;
};

const createTagsTemplate = (task) => {
  let tagsTemplate =
  `                   <div class="card__hashtag">
                      <div class="card__hashtag-list">
`;
  for (let tag of task.tags) {
    const cardTag = getTagTemplate(tag);
    tagsTemplate += cardTag;
  }
  tagsTemplate +=
  `                     </div>
                        </div>`;
  return tagsTemplate;
};

const createTaskTemplate = (task) => {
  const values = Object.values(task);
  let repeatStatus = values.some((value) => {
    return value;
  });
  return (
    `          <article class="card card--${task.color} ${repeatStatus ? `card--repeat` : ``} ${checkTaskIsDead(task) ? `card--deadline` : ``}">
           <div class="card__form">
              <div class="card__inner">
                <div class="card__control">
                  <button type="button" class="card__btn card__btn--edit">
                    edit
                  </button>
                  <button type="button" class="card__btn card__btn--archive ${task.isArchive ? `card__btn--disabled` : ``}">
                    archive
                  </button>
                  <button
                    type="button"
                    class="card__btn card__btn--favorites ${task.isFavorite ? `card__btn--disabled` : ``}">
                    favorites
                  </button>
                </div>

                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

               <div class="card__textarea-wrap">
                 <p class="card__text">${task.description}</p>
               </div>

               <div class="card__settings">
                 <div class="card__details">
                   <div class="card__dates">
                     <div class="card__date-deadline">
                       <p class="card__input-deadline-wrap">
                         <span class="card__date">${task.dueDate.getDate()} ${months[task.dueDate.getMonth()]}</span>
                         <span class="card__time">${task.dueDate.getHours()}:${getMinutes(task.dueDate)}</span>
                       </p>
                     </div>
                   </div>
                   ${createTagsTemplate(task)}
                 </div>
               </div>
             </div>
           </div>
         </article>`
  );
};

export default class Task {
  constructor(task) {
    this._element = null;
    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
