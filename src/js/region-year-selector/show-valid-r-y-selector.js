import ValidatingRYSelector from './validating-r-y-selector';

export default class ShowValidRYSelector extends ValidatingRYSelector {
  constructor({ numRegions, region, numYears, year, validator }) {
    super({ numRegions, region, numYears, year, validator });
  }

  computeRY(baseRegion, regionOffset, baseYear, yearOffset) {
    const { region, year, validYear } = super.computeRY(
      baseRegion,
      regionOffset,
      baseYear,
      yearOffset,
    );

    return { region, year, yearToShow: validYear, validYear };
  }
}
