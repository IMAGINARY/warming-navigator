import clamp from 'lodash.clamp';

export default class RYSelector {
  constructor({ numRegions, region, numYears, year }) {
    this.numRegions = numRegions;
    this.region = region;
    this.numYears = numYears;
    this.year = year;
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
