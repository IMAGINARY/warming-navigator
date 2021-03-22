export default class Input {
  constructor() {
    this._warmingNavigators = [];
  }

  attach(warmingNavigator) {
    this._warmingNavigators.push(warmingNavigator);
    if (this._warmingNavigators.length === 1) {
      this._attachListeners();
    }
  }

  detach(warmingNavigator) {
    const i = this._warmingNavigators.indexOf(warmingNavigator);
    if (i !== -1) {
      this._warmingNavigators.splice(i, 1);
      if (this._warmingNavigators.length === 0) {
        this._detachListeners();
      }
    }
    return i !== -1;
  }

  isAttached(warmingNavigator) {
    return this._warmingNavigators.indexOf(warmingNavigator) !== -1;
  }

  _prevYear() {
    this._warmingNavigators.forEach((wn) => wn.prevYear());
  }

  _nextYear() {
    this._warmingNavigators.forEach((wn) => wn.nextYear());
  }

  _prevRegion() {
    this._warmingNavigators.forEach((wn) => wn.prevRegion());
  }

  _nextRegion() {
    this._warmingNavigators.forEach((wn) => wn.nextRegion());
  }

  // eslint-disable-next-line class-methods-use-this
  _attachListeners() {}

  // eslint-disable-next-line class-methods-use-this
  _detachListeners() {}
}
