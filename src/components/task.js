// task.js

import he from 'he';
import {isOverdueDate} from '../date.js';
import {months, getMinutes} from '../data.js';
import AbstractComponent from './abstract.js';

const checkTaskIsDead = (task) => {
  const currDate = new Date();
  return isOverdueDate(task.dueDate, currDate);
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
  const description = he.encode(task.description);
  let repeatStatus = Object.values(task.repeatingDays).some(Boolean);

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
                 <p class="card__text">${description}</p>
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

export default class Task extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  get id() {
    return this._task.id;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`).
    addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`).
    addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`).
    addEventListener(`click`, handler);
  }
}
