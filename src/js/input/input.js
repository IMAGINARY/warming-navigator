export default class Input {
  constructor() {
    this._warmingNavigators = [];
  }

  attach(warmingNavigator) {
    this._warmingNavigators.push(warmingNavigator);
  }

  detach(warmingNavigator) {
    const i = this._warmingNavigators.indexOf(warmingNavigator);
    if (i !== -1) {
      this._warmingNavigators.splice(i, 1);
      return true;
    }
    return false;
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
}
