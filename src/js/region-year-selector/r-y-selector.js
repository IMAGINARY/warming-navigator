import EventEmitter from 'events';

export default class RYSelector extends EventEmitter {
  constructor({ numRegions, region, numYears, year }) {
    super();
    this.numRegions = numRegions;
    this.numYears = numYears;
    this.region = region;
    this.year = year;
    this.initialized = false;
  }

  ensureInitializedRY() {
    if (!this.initialized) {
      this.mutateRY(this.region, 0, this.year, 0, false);
      this.initialized = true;
    }
  }

  // Should be overwritten in subclasses
  computeRY(baseRegion, regionOffset, baseYear, yearOffset) {
    const nr = this.getNumRegions();
    const region = (baseRegion + nr + (regionOffset % nr)) % nr;

    const ny = this.getNumYears();
    const year = (baseYear + ny + (yearOffset % ny)) % ny;

    const yearToShow = year;

    return { region, year, yearToShow };
  }

  mutateRY(baseRegion, regionOffset, baseYear, yearOffset, emit = true) {
    const { region, year, yearToShow } = this.computeRY(
      baseRegion,
      regionOffset,
      baseYear,
      yearOffset
    );

    const regionChanged = region !== this.region;
    this.region = region;
    if (emit && regionChanged) {
      this.emit('region-changed');
    }

    const yearChanged = year !== this.year;
    this.year = year;
    if (emit && yearChanged) {
      this.emit('year-changed');
    }

    const yearToShowChanged = yearToShow !== this.yeartoShow;
    this.yearToShow = yearToShow;
    if (emit && yearToShowChanged) {
      this.emit('year-to-show-changed');
    }

    if (emit && (regionChanged || yearChanged || yearToShowChanged)) {
      this.emit('changed');
    }
  }

  getNumRegions() {
    return this.numRegions;
  }

  getRegion() {
    this.ensureInitializedRY();
    return this.region;
  }

  prevRegion() {
    this.mutateRY(this.getRegion(), -1, this.getYear(), 0);
  }

  nextRegion() {
    this.mutateRY(this.getRegion(), +1, this.getYear(), 0);
  }

  setRegion(region) {
    this.mutateRY(region, 0, this.getYear(), 0);
  }

  getNumYears() {
    return this.numYears;
  }

  getYear() {
    this.ensureInitializedRY();
    return this.year;
  }

  getYearToShow() {
    this.ensureInitializedRY();
    return this.yearToShow;
  }

  prevYear() {
    this.mutateRY(this.getRegion(), 0, this.getYear(), -1);
  }

  nextYear() {
    this.mutateRY(this.getRegion(), 0, this.getYear(), 1);
  }

  setYear(year) {
    this.mutateRY(this.getRegion(), 0, year, 0);
  }
}
