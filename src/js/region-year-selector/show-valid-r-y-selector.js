import ValidatingRYSelector from './validating-r-y-selector';

export default class ShowValidRYSelector extends ValidatingRYSelector {
  constructor({ numRegions, region, numYears, year, validator }) {
    super({ numRegions, region, numYears, year, validator });
  }

  getYearToShow() {
    return this.yearToShow;
  }
}
