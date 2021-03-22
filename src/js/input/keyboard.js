import over from 'lodash.over';

import Input from './input';

import { keyboard as defaultOptions } from '../options/defaultOptions';

function ifKey(key, cb) {
  return (e) => (e.key === key ? cb() : undefined);
}

export default class Keyboard extends Input {
  constructor(options) {
    super();

    const { prevRegionKey, nextRegionKey, prevYearKey, nextYearKey } = {
      ...defaultOptions,
      ...options,
    };

    this._callback = over([
      ifKey(prevRegionKey, this._prevRegion.bind(this)),
      ifKey(nextRegionKey, this._nextRegion.bind(this)),
      ifKey(prevYearKey, this._prevYear.bind(this)),
      ifKey(nextYearKey, this._nextYear.bind(this)),
    ]);
  }

  _attachListeners() {
    document.addEventListener('keydown', this._callback);
  }

  _detachListeners() {
    document.removeEventListener('keydown', this._callback);
  }
}
