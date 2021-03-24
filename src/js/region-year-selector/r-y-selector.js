import EventEmitter from 'events';
import clamp from 'lodash.clamp';

export default class RYSelector extends EventEmitter {
  constructor({ numRegions, region, numYears, year }) {
    super();
    this.numRegions = numRegions;
    this._region = region;
    this.numYears = numYears;
    this._year = year;
    this._yearToShow = year;
  }

  get region() {
    return this._region;
  }

  set region(r) {
    const emit = r !== this._region;
    this._region = r;
    if (emit) {
      this.emit('region-changed');
    }
  }

  get year() {
    return this._year;
  }

  set year(y) {
    const emit = y !== this._year;
    this._year = y;
    if (emit) {
      this.emit('year-changed');
    }
  }

  get yearToShow() {
    return this._yearToShow;
  }

  set yearToShow(y) {
    const emit = y !== this._yearToShow;
    this._yearToShow = y;
    if (emit) {
      this.emit('year-to-show-changed');
    }
  }

  getNumRegions() {
    return this.numRegions;
  }

  getRegion() {
    return this.region;
  }

  prevRegion() {
    this.region = (this.numRegions + this.region - 1) % this.numRegions;
  }

  nextRegion() {
    this.region = (this.region + 1) % this.numRegions;
  }

  setRegion(region) {
    this.region = clamp(region, this.numRegions);
  }

  getNumYears() {
    return this.numYears;
  }

  getYear() {
    return this.year;
  }

  getYearToShow() {
    return this.getYear();
  }

  prevYear() {
    this.year = (this.numYears + this.year - 1) % this.numYears;
  }

  nextYear() {
    this.year = (this.year + 1) % this.numYears;
  }

  setYear(year) {
    this.year = clamp(year - this.minYear, this.numYears);
  }
}
