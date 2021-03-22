import Input from './input';

import { keyboard as defaultOptions } from '../defaultOptions';

function ifKey(key, cb) {
  return (e) => (e.key === key ? cb() : undefined);
}

function addKeyDownListener(key, cb) {
  document.addEventListener('keydown', ifKey(key, cb));
}

export default class Keyboard extends Input {
  constructor(options) {
    super();

    const { prevRegionKey, nextRegionKey, prevYearKey, nextYearKey } = {
      ...defaultOptions,
      ...options,
    };

    addKeyDownListener(prevRegionKey, this._prevRegion.bind(this));
    addKeyDownListener(nextRegionKey, this._nextRegion.bind(this));
    addKeyDownListener(prevYearKey, this._prevYear.bind(this));
    addKeyDownListener(nextYearKey, this._nextYear.bind(this));
  }
}
