// api.js

import {TaskObject as Task} from './data.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const errorHandle = (error) => {
  const node = document.createElement(`div`);
  node.style = `width: 180px; margin: 0 auto; text-align: center; background-color: red;`;
  node.textContent = error;
  document.body.insertAdjacentElement(`afterbegin`, node);
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  checkStatus(response) {
    const status = response.status;
    if (status >= 200 && status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  getTasks() {
    return this._load({
      url: `tasks`,
      method: Method.GET,
      body: null,
      headers: new Headers()
    })
      .then((response) => response.json())
      .then((data) => data.map(Task.parse))
      .catch(errorHandle);
  }

  createTask(task) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task.raw()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((data) => Task.parse(data))
      .catch(errorHandle);
  }

  updateTask(id, task) {
    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(task.raw()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((data) => Task.parse(data))
      .catch(errorHandle);
  }

  deleteTask(id) {
    return this._load({url: `tasks/${id}`, method: Method.DELETE});
  }

  sync(data) {
    return this._load({
      url: `tasks/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .catch(errorHandle);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this.checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
