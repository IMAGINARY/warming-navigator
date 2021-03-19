import RYSelector from './r-y-selector';

export default class ValidatingRYSelector extends RYSelector {
  constructor({ numRegions, region, numYears, year, validator }) {
    super({ numRegions, region, numYears, year });
    this.validator = validator;
    this.yearToShow = this.getClosestValidYear(this.year);
  }

  isValid(year) {
    return this.validator(this.getRegion(), year);
  }

  getPrevValidYear(year) {
    for (let i = 0; i < this.numYears; i += 1) {
      const y = (this.numYears + year - i) % this.numYears;
      if (this.isValid(y)) {
        return y;
      }
    }
    return year;
  }

  getNextValidYear(year) {
    for (let i = 0; i < this.numYears; i += 1) {
      const y = (year + i) % this.numYears;
      if (this.isValid(y)) {
        return y;
      }
    }
    return year;
  }

  getClosestValidYear(year) {
    for (let i = 0; i < this.numYears; i += 1) {
      const ly = (this.numYears + year - i) % this.numYears;
      const hy = (year + i) % this.numYears;
      if (this.isValid(ly)) {
        return ly;
      }
      if (this.isValid(hy)) {
        return hy;
      }
    }
    return year;
  }

  prevRegion() {
    super.prevRegion();
    this._setYearToShow(this.getClosestValidYear(this.year));
  }

  nextRegion() {
    super.nextRegion();
    this._setYearToShow(this.getClosestValidYear(this.year));
  }

  setRegion(region) {
    super.setRegion(region);
    this._setYearToShow(this.getClosestValidYear(this.year));
  }

  prevYear() {
    super.prevYear();
    this._setYearToShow(this.getPrevValidYear(this.year));
  }

  nextYear() {
    super.nextYear();
    this._setYearToShow(this.getNextValidYear(this.year));
  }

  _setYearToShow(year) {
    this.yearToShow = year;
  }

  getYearToShow() {
    return this.yearToShow;
  }

  setYear(year) {
    super.setYear(year);
    this._setYearToShow(this.getClosestValidYear(this.year));
  }
}
