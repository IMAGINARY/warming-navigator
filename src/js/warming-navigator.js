import random from 'lodash.random';

import { warmingNavigator as defaultOptions } from './defaultOptions';

import ShowRYSelector from './region-year-selector/show-r-y-selector';
import ShowValidRYSelector from './region-year-selector/show-valid-r-y-selector';
import AdjustToValidRYSelector from './region-year-selector/adjust-to-valid-r-y-selector';

function mixColor(c1, c2, t) {
  return Array(3)
    .fill(0)
    .map((_, i) => (1 - t) * c1[i] + t * c2[i]);
}

export default class WarmingNavigator {
  constructor(element, data, options) {
    this.element =
      element instanceof Element ? element : document.querySelector(element);
    this.regionElement = this.element.querySelector('.region');
    this.yearElement = this.element.querySelector('.year');
    this.anomalyElement = this.element.querySelector('.anomaly');
    this.uncertaintyElement = this.element.querySelector('.uncertainty');
    this.data = data;
    this._processOptions({ ...defaultOptions, ...options });
    this._update();
  }

  _processOptions(o) {
    const assert = (cond, key, types) => {
      if (!cond) {
        const msg = `Invalid option: ${key}=${o[key]}. (Wanted: ${types})`;
        throw new Error(msg);
      }
    };
    const propertyOrInt = function (optionKey, obj) {
      const optionValue = o[optionKey];

      if (typeof obj[optionValue] !== 'undefined') return obj[optionValue];

      const num = Number.parseInt(optionValue, 10);
      if (Number.isFinite(num)) return num;

      assert(false, optionKey, ['<Integer>', ...Object.keys(obj)]);

      return null;
    };

    const minYears = {
      data: this.data.yearRange[0],
      valid: this.data.validYearRange[0],
    };
    this.minYear = propertyOrInt('minYear', minYears);

    const maxYears = {
      data: this.data.yearRange[1],
      valid: this.data.validYearRange[1],
    };
    this.maxYear = propertyOrInt('maxYear', maxYears);

    const initialYears = {
      first: this.minYear,
      last: this.maxYear,
      random: random(this.minYear, this.maxYear),
    };
    const initialYear = propertyOrInt('initialYear', initialYears);

    const initialRegions = {
      first: 0,
      last: this.data.regions.length - 1,
      random: random(0, this.data.regions.length - 1),
    };
    const initialRegion = propertyOrInt('initialRegion', initialRegions);

    assert(this.data.languages.includes(o.lang), 'lang', this.data.languages);
    this.language = o.lang;

    const rySelectorClasses = {
      'show': ShowRYSelector,
      'show-valid': ShowValidRYSelector,
      'adjust-to-valid': AdjustToValidRYSelector,
    };
    const RYSelectorClass = rySelectorClasses[o.invalidYear];
    assert(
      typeof RYSelectorClass !== 'undefined',
      'invalidYear',
      Object.keys(rySelectorClasses)
    );

    this.rySelector = new RYSelectorClass({
      numRegions: this.data.regions.length,
      region: initialRegion,
      numYears: this.maxYear - this.minYear + 1,
      year: initialYear - this.minYear,
      validator: (r, y) => this.isValid(r, this.minYear + y),
    });
  }

  isValid(regionIndex, year) {
    const { anomaly } = this._getRecord(regionIndex, year);
    return anomaly !== null;
  }

  _formatAnomaly(anomaly) {
    if (Number.isFinite(anomaly)) {
      const formatterOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
      const formatter = new Intl.NumberFormat(this.language, formatterOptions);
      return `${anomaly < 0 ? '' : '+'}${formatter.format(anomaly)}°C`;
    }
    return '----';
  }

  _formatUncertainty(uncertainty) {
    if (Number.isFinite(uncertainty)) {
      const formatterOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
      const formatter = new Intl.NumberFormat(this.language, formatterOptions);
      return `±${formatter.format(uncertainty)}°C`;
    }
    return '----';
  }

  _displayRecord(region, year, anomaly, uncertainty, color) {
    this.regionElement.innerText = region;
    this.yearElement.innerText = year;
    this.anomalyElement.innerText = this._formatAnomaly(anomaly);
    this.uncertaintyElement.innerText = this._formatUncertainty(uncertainty);
    this.element.style.backgroundColor = color;
  }

  _getRecord(regionIndex, year) {
    const region = this.data.regions[regionIndex];
    const regionTitle = region.title[this.language];
    const indexForYear = year - region.firstYear;
    const anomaly =
      indexForYear >= 0 && indexForYear < region.anomalies.length
        ? region.anomalies[indexForYear]
        : null;
    const uncertainty =
      indexForYear >= 0 && indexForYear < region.uncertainties.length
        ? region.uncertainties[indexForYear]
        : null;
    const color = WarmingNavigator.getCssColor(
      anomaly,
      region.shift,
      region.scale
    );
    return { region: regionTitle, year, anomaly, uncertainty, color };
  }

  static getCssColor(anomaly, shift, scale) {
    const toCss = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;
    return toCss(WarmingNavigator.getColor(anomaly, shift, scale));
  }

  static getColor(anomaly, shift, scale) {
    const v = (anomaly - shift) * scale;
    const t = Math.abs(v);

    const white = [255, 255, 255];
    const black = [0, 0, 0];

    const blues = [
      [247, 251, 255],
      [222, 235, 247],
      [198, 219, 239],
      [158, 202, 225],
      [107, 174, 214],
      [66, 146, 198],
      [33, 113, 181],
      [8, 81, 156],
      [8, 48, 107],
    ];

    const reds = [
      [255, 245, 240],
      [254, 224, 210],
      [252, 187, 161],
      [252, 146, 114],
      [251, 106, 74],
      [239, 59, 44],
      [203, 24, 29],
      [165, 15, 21],
      [103, 0, 13],
    ];

    if (!Number.isFinite(v)) {
      return mixColor(black, white, 0.6);
    }
    const colors = v > 0 ? reds : blues;
    if (t > 1.0) {
      return colors[colors.length - 1];
    }
    const idxLo = Math.floor(t * (colors.length - 1));
    const idxHi = Math.ceil(t * (colors.length - 1));
    const u = t * (colors.length - 1) - idxLo;
    return mixColor(colors[idxLo], colors[idxHi], u);
  }

  getRegion() {
    return this.rySelector.getRegion();
  }

  getYear() {
    return this.rySelector.getYear() + this.minYear;
  }

  getYearToShow() {
    return this.rySelector.getYearToShow() + this.minYear;
  }

  setRegion(index) {
    this.rySelector.setRegion(index);
    this._update();
  }

  setYear(year) {
    this.rySelector.setYear(year - this.minYear);
    this._update();
  }

  prevRegion() {
    this.rySelector.prevRegion();
    this._update();
  }

  nextRegion() {
    this.rySelector.nextRegion();
    this._update();
  }

  prevYear() {
    this.rySelector.prevYear();
    this._update();
  }

  nextYear() {
    this.rySelector.nextYear();
    this._update();
  }

  _update() {
    const { region, year, anomaly, uncertainty, color } = this._getRecord(
      this.rySelector.getRegion(),
      this.rySelector.getYearToShow() + this.minYear
    );
    this._displayRecord(region, year, anomaly, uncertainty, color);
  }
}
