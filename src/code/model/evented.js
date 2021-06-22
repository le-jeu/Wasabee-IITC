export default class Evented {
  constructor() {
    this._events = {};
  }

  on(event, func, context) {
    if (!(event in this._events)) this._events[event] = [];
    this._events[event].push({ fct: func, context: context });
    return this;
  }

  off(event, func, context) {
    const listeners = this._events[event];
    if (listeners) {
      for (let i = listeners.length - 1; i >= 0; i--) {
        const listener = listeners[i];
        if (listener.fct === func && listener.context === context) {
          listeners.splice(i, 1);
        }
      }
    }
    return this;
  }

  fire(event, data) {
    const listeners = this._events[event];
    if (listeners) {
      for (const listener of listeners) {
        listener.fct.call(listener.context, data);
      }
    }
    return this;
  }
}
