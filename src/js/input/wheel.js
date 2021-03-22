import Input from './input';

import { wheel as defaultOptions } from '../options/defaultOptions';

function swapProps(o, keyA, keyB) {
  const valueA = o[keyA];
  // eslint-disable-next-line no-param-reassign
  o[keyA] = o[keyB];
  // eslint-disable-next-line no-param-reassign
  o[keyB] = valueA;
}

export default class Wheel extends Input {
  constructor(options) {
    super();

    const { delta, invertX, invertY, regionHorYearVert } = {
      ...defaultOptions,
      ...options,
    };

    this._stepDelta = delta;
    this._deltaX = 0;
    this._deltaY = 0;

    this._stepFuncs = {
      x: {
        dec: this._prevRegion.bind(this),
        inc: this._nextRegion.bind(this),
      },
      y: {
        dec: this._prevYear.bind(this),
        inc: this._nextYear.bind(this),
      },
    };

    if (!regionHorYearVert) {
      swapProps(this._stepFuncs, 'x', 'y');
    }

    if (invertX) {
      swapProps(this._stepFuncs.x, 'dec', 'inc');
    }

    if (invertY) {
      swapProps(this._stepFuncs.y, 'dec', 'inc');
    }

    this._callback = this._handleWheel.bind(this);
  }

  _handleWheel(event) {
    if (event.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
      this._deltaX += event.deltaX;
      this._deltaY += event.deltaY;
      while (this._deltaX <= -this._stepDelta) {
        this._stepFuncs.x.dec();
        this._deltaX += this._stepDelta;
      }
      while (this._deltaX >= this._stepDelta) {
        this._stepFuncs.x.inc();
        this._deltaX -= this._stepDelta;
      }
      while (this._deltaY <= -this._stepDelta) {
        this._stepFuncs.y.dec();
        this._deltaY += this._stepDelta;
      }
      while (this._deltaY >= this._stepDelta) {
        this._stepFuncs.y.inc();
        this._deltaY -= this._stepDelta;
      }
    }
  }

  _attachListeners() {
    document.addEventListener('wheel', this._callback);
  }

  _detachListeners() {
    document.removeEventListener('wheel', this._callback);
  }
}
