import ShowValidRYSelector from './show-valid-r-y-selector';

export default class AdjustToValidRYSelector extends ShowValidRYSelector {
  constructor({ numRegions, region, numYears, year, validator }) {
    super({ numRegions, region, numYears, year, validator });
  }

  _setYearToShow(year) {
    this.yearToShow = year;
    this.year = year;
  }
}
