import ShowValidRYSelector from './show-valid-r-y-selector';

export default class AdjustToValidRYSelector extends ShowValidRYSelector {
  constructor({ numRegions, region, numYears, year, validator }) {
    super({ numRegions, region, numYears, year, validator });
  }

  computeRY(baseRegion, regionOffset, baseYear, yearOffset) {
    const { region, validYear } = super.computeRY(
      baseRegion,
      regionOffset,
      baseYear,
      yearOffset
    );

    return { region, year: validYear, yearToShow: validYear, validYear };
  }
}
