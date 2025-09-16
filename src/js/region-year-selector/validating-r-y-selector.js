import RYSelector from './r-y-selector';

export default class ValidatingRYSelector extends RYSelector {
  constructor({ numRegions, region, numYears, year, validator }) {
    super({ numRegions, region, numYears, year });
    this.validator = validator;
  }

  isValid(region, year) {
    return this.validator(region, year);
  }

  getPrevValidYear(region, year) {
    for (let i = 0; i < this.numYears; i += 1) {
      const y = (this.numYears + year - i) % this.numYears;
      if (this.isValid(region, y)) {
        return y;
      }
    }
    return year;
  }

  getNextValidYear(region, year) {
    for (let i = 0; i < this.numYears; i += 1) {
      const y = (year + i) % this.numYears;
      if (this.isValid(region, y)) {
        return y;
      }
    }
    return year;
  }

  getClosestValidYear(region, year) {
    for (let i = 0; i < this.numYears; i += 1) {
      const ly = (this.numYears + year - i) % this.numYears;
      const hy = (year + i) % this.numYears;
      if (this.isValid(region, ly)) {
        return ly;
      }
      if (this.isValid(region, hy)) {
        return hy;
      }
    }
    return year;
  }

  // Should be overwritten in subclasses
  computeRY(baseRegion, regionOffset, baseYear, yearOffset) {
    const { region, year, yearToShow } = super.computeRY(
      baseRegion,
      regionOffset,
      baseYear,
      yearOffset,
    );

    let validYear;
    if (yearOffset < 0) {
      validYear = this.getPrevValidYear(region, year);
    } else if (yearOffset > 0) {
      validYear = this.getNextValidYear(region, year);
    } else {
      validYear = this.getClosestValidYear(region, year);
    }

    return { region, year, yearToShow, validYear };
  }
}
