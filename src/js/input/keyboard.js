import { over } from 'es-toolkit/compat';

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
      ifKey(prevRegionKey, this.handleDecreaseRegion.bind(this)),
      ifKey(nextRegionKey, this.handleIncreaseRegion.bind(this)),
      ifKey(prevYearKey, this.handleDecreaseYear.bind(this)),
      ifKey(nextYearKey, this.handleIncreaseYear.bind(this)),
    ]);
    document.addEventListener('keydown', this._callback);
  }
}
