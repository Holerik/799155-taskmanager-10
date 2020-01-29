// task-edit.js

import AbstractSmartComponent from './abstract-smart.js';
import {formatTime, formatDate} from '../date.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 140;

const isAllowableDescriptionLength = (description) => {
  const length = description.length;

  return length >= MIN_DESCRIPTION_LENGTH &&
    length <= MAX_DESCRIPTION_LENGTH;
};

const defaultButtonText = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};


const createTagTemplate = (tag) => {
  return (`
                        <span class="card__hashtag-inner">
                          <input
                            type="hidden"
                            name="hashtag"
                            value="${tag}"
                            class="card__hashtag-hidden-input"
                          />
                          <p class="card__hashtag-name">
                            #${tag}
                          </p>
                          <button type="button" class="card__hashtag-delete">
                            delete
                          </button>
                        </span>
  `);
};

const createTagsTemplate = (task) => {
  let element = `                      <div class="card__hashtag-list">
`;
  for (let tag of task.tags) {
    element += createTagTemplate(tag);
  }
  element +=
`           </div>`;
  return element;
};

const createTaskEditTemplate = (task, isDateShowing, isRepeatingTask, repeatingDays, buttonText) => {
  const date = (isDateShowing && task.dueDate) ? formatDate(task.dueDate) : ``;
  const time = (isDateShowing && task.dueDate) ? formatTime(task.dueDate) : ``;
  const description = task.description;
  const deleteButtonText = buttonText.deleteButtonText;
  const saveButtonText = buttonText.saveButtonText;

  const isSaveButtonBlocked = (isDateShowing && isRepeatingTask) ||
    (isRepeatingTask && !Object.values(repeatingDays).some(Boolean)) ||
    !isAllowableDescriptionLength(description);

  let element =
    `          <article class="card__edit card--edit card--${task.color} ${isRepeatingTask ? `card--repeat` : ``}">
            <form class="card__form" method="get">
              <div class="card__inner">
                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <label>
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="text"
                    >${description}</textarea>
                  </label>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button">
                        date: <span class="card__date-status">${!isDateShowing ? `no` : `yes`}</span>
                      </button>

                      <fieldset class="card__date-deadline">
                        <label class="card__input-deadline-wrap">
                          <input
                            class="card__date"
                            type="text"
                            placeholder=""
                            name="date"
                            value="${date} ${time}"
                          />
                        </label>
                      </fieldset>

                      <button class="card__repeat-toggle" type="button">
                        repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                      </button>

                      <fieldset class="card__repeat-days ${isRepeatingTask ? `` : `visually-hidden`}">
                        <div class="card__repeat-days-inner">
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-mo-4"
                            name="repeat"
                            value="mo"
                            ${repeatingDays[`mo`] ? `checked` : ``}
                          />
                          <label class="card__repeat-day" for="repeat-mo-4"
                            >mo</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-tu-4"
                            name="repeat"
                            value="tu"
                            ${repeatingDays[`tu`] ? `checked` : ``}
                          />
                          <label class="card__repeat-day" for="repeat-tu-4"
                            >tu</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-we-4"
                            name="repeat"
                            value="we"
                            ${repeatingDays[`we`] ? `checked` : ``}
                          />
                          <label class="card__repeat-day" for="repeat-we-4"
                            >we</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-th-4"
                            name="repeat"
                            value="th"
                            ${repeatingDays[`th`] ? `checked` : ``}
                          />
                          <label class="card__repeat-day" for="repeat-th-4"
                            >th</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-fr-4"
                            name="repeat"
                            value="fr"
                            ${repeatingDays[`fr`] ? `checked` : ``}
                          />
                          <label class="card__repeat-day" for="repeat-fr-4"
                            >fr</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            name="repeat"
                            value="sa"
                            id="repeat-sa-4"
                            ${repeatingDays[`sa`] ? `checked` : ``}
                          />
                          <label class="card__repeat-day" for="repeat-sa-4"
                            >sa</label
                          >
                          <input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-su-4"
                            name="repeat"
                            value="su"
                            ${repeatingDays[`su`] ? `checked` : ``}
                          />
                          <label class="card__repeat-day" for="repeat-su-4"
                            >su</label
                          >
                        </div>
                      </fieldset>
                    </div>

                    <div class="card__hashtag">`;
  element += createTagsTemplate(task);
  element +=
`                  </div>

                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                      <input
                        type="radio"
                        id="color-black-4"
                        class="card__color-input card__color-input--black visually-hidden"
                        name="color"
                        value="black"
                      />
                      <label
                        for="color-black-4"
                        class="card__color card__color--black"
                        >black</label
                      >
                      <input
                        type="radio"
                        id="color-yellow-4"
                        class="card__color-input card__color-input--yellow visually-hidden"
                        name="color"
                        value="yellow"
                        checked
                      />
                      <label
                        for="color-yellow-4"
                        class="card__color card__color--yellow"
                        >yellow</label
                      >
                      <input
                        type="radio"
                        id="color-blue-4"
                        class="card__color-input card__color-input--blue visually-hidden"
                        name="color"
                        value="blue"
                      />
                      <label
                        for="color-blue-4"
                        class="card__color card__color--blue"
                        >blue</label
                      >
                      <input
                        type="radio"
                        id="color-green-4"
                        class="card__color-input card__color-input--green visually-hidden"
                        name="color"
                        value="green"
                      />
                      <label
                        for="color-green-4"
                        class="card__color card__color--green"
                       >green</label
                     >
                     <input
                        type="radio"
                        id="color-pink-4"
                        class="card__color-input card__color-input--pink visually-hidden"
                        name="color"
                        value="pink"
                      />
                      <label
                        for="color-pink-4"
                        class="card__color card__color--pink"
                        >pink</label
                      >
                    </div>
                  </div>
                </div>

                <div class="card__status-btns">
                  <button class="card__save" type="submit" ${isSaveButtonBlocked ? `disabled` : ``}>${saveButtonText}</button>
                  <button class="card__delete" type="button">${deleteButtonText}</button>
                </div>
              </div>
            </form>
          </article>`;
  return element;
};

export default class TaskPopup extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._isDateShowing = !this._isRepeatingTask;
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;
    this._submitClickHandler = null;
    this._flatpickr = null;
    this._deleteClickHandler = null;
    this._buttonText = defaultButtonText;
    this.getElement().querySelector(`#color-${this._task.color}-4`).checked = true;
    if (this._isDateShowing) {
      this._applyFlatpickr();
    }
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, this._isDateShowing,
        this._isRepeatingTask, this._activeRepeatingDays, this._buttonText);
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    super.removeElement();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`.card__form`).
    addEventListener(`submit`, handler);
    this._submitClickHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`).
    addEventListener(`click`, handler);
    this._deleteClickHandler = handler;
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitClickHandler);
    this.setDeleteButtonClickHandler(this._deleteClickHandler);
    this._subscribeOnEvents();
  }

  reset() {
    this._isDateShowing = !!this._task.dueDate;
    this._isRepeatingTask = Object.values(this._task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, this._task.repeatingDays);
    this._currentDescription = this._task.description;
    this.rerender();
  }

  rerender() {
    super.rerender();
    this.getElement().querySelector(`#color-${this._task.color}-4`).checked = true;
    this._applyFlatpickr();
    this.getElement().querySelector(`.card__text`).textContent = this._currentDescription;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      // При своем создании `flatpickr` дополнительно создает вспомогательные DOM-элементы.
      // Что бы их удалять, нужно вызывать метод `destroy` у созданного инстанса `flatpickr`.
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate,
      });
    }
  }

  disableSaveButton(disable) {
    const saveButton = this.getElement().querySelector(`.card__save`);
    saveButton.disabled = disable === true;
  }

  disableDeleteButton(disable) {
    const deleteButton = this.getElement().querySelector(`.card__delete`);
    deleteButton.disabled = disable === true;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const elements = element.querySelectorAll(`.card__hashtag-delete`);
    for (let item of elements) {
      item.addEventListener(`click`, (evt) => {
        const targetTag = evt.target.parentNode.querySelector(`.card__hashtag-name`).textContent;
        for (let tag of this._task.tags) {
          if (targetTag.indexOf(tag) > -1) {
            this._task.tags.delete(tag);
            this.rerender();
            break;
          }
        }
      });
    }

    element.querySelector(`.card__colors-wrap`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (evt.target.tagName !== `LABEL`) {
          return;
        }
        const color = evt.target.textContent;
        this.getElement().classList.remove(`card--${this._task.color}`);
        this._task.color = color;
        this.getElement().classList.add(`card--${color}`);
        this.getElement().querySelector(`#color-${color}-4`).checked = true;
      });

    element.querySelector(`.card__text`)
      .addEventListener(`input`, (evt) => {
        this._currentDescription = evt.target.value;
        this.disableSaveButton(!isAllowableDescriptionLength(this._currentDescription));
      });

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;
        this._isRepeatingTask = !this._isDateShowing;
        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;
        this._isDateShowing = !this.isRepeatingTask;
        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;
        this.rerender();
        this.disableSaveButton(!Object.values(this._activeRepeatingDays).some(Boolean));
      });
    }
  }

  setButtonText(buttonText) {
    this._buttonText = Object.assign({}, defaultButtonText, buttonText);
    this.rerender();
  }
}
