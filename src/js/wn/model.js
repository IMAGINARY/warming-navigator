function identityMapping(data) {
  return Array(data.regions.length)
    .fill(0)
    .map((_, i) => i);
}

function sortedMapping(data, language) {
  const mapping = identityMapping(data);
  const { regions } = data;
  mapping.sort((ia, ib) => {
    const ra = regions[ia];
    const rb = regions[ib];
    return String(ra?.title[language]).localeCompare(rb?.title[language]);
  });
  return mapping;
}

export default class Model {
  constructor(
    data,
    minYear,
    maxYear,
    lang,
    sort,
    shift = undefined,
    scale = undefined,
  ) {
    this.data = data;
    this.minYear = minYear;
    this.maxYear = maxYear;
    this.language = lang;
    this.sort = true;
    this.regionMapping = (sort ? sortedMapping : identityMapping)(data, lang);
    this.shift = shift;
    this.scale = scale;
  }

  _getRegion(regionIndex) {
    return this.data.regions[this.regionMapping[regionIndex]];
  }

  getNumRegions() {
    return this.data.regions.length;
  }

  getLanguage() {
    return this.language;
  }

  getMinYear() {
    return this.minYear;
  }

  getMaxYear() {
    return this.maxYear;
  }

  getNumYears() {
    return this.getMaxYear() - this.getMinYear() + 1;
  }

  isSorted() {
    return this.sort;
  }

  getTitle(regionIndex) {
    const region = this._getRegion(regionIndex);
    return region.title[this.getLanguage()];
  }

  isValid(regionIndex, year) {
    const { anomaly } = this.getRecord(regionIndex, year);
    return anomaly !== null;
  }

  getRecord(regionIndex, year) {
    const region = this._getRegion(regionIndex);
    const indexForYear =
      this.getMinYear() <= year && year <= this.getMaxYear()
        ? year - region.firstYear
        : -1;

    const anomaly =
      indexForYear >= 0 && indexForYear < region.anomalies.length
        ? region.anomalies[indexForYear]
        : null;

    const shift = this.shift ?? region.shift;
    const scale = this.scale ?? region.scale;
    const relativeAnomaly = anomaly === null ? null : (anomaly - shift) * scale;

    const uncertainty =
      indexForYear >= 0 && indexForYear < region.uncertainties.length
        ? region.uncertainties[indexForYear]
        : null;
    return { anomaly, relativeAnomaly, uncertainty };
  }

  getShift(regionIndex) {
    const region = this._getRegion(regionIndex);
    return region.shift;
  }

  getScale(regionIndex) {
    const region = this._getRegion(regionIndex);
    return region.scale;
  }
}
