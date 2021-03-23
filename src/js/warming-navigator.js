import random from 'lodash.random';
import Color from 'color';

import { warmingNavigator as defaultOptions } from './options/defaultOptions';

import ShowRYSelector from './region-year-selector/show-r-y-selector';
import ShowValidRYSelector from './region-year-selector/show-valid-r-y-selector';
import AdjustToValidRYSelector from './region-year-selector/adjust-to-valid-r-y-selector';

import palettes from './palettes';

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

    const { blues, reds, invalid } = palettes[o.palette];
    this.palette = {
      blues: blues.map((hex) => Color(hex)),
      reds: reds.map((hex) => Color(hex)),
      invalid: Color(invalid),
    };

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
    const color = this.getCssColor(anomaly, region.shift, region.scale);
    return { region: regionTitle, year, anomaly, uncertainty, color };
  }

  getCssColor(anomaly, shift, scale) {
    return this.getColor(anomaly, shift, scale).hex();
  }

  getColor(anomaly, shift, scale) {
    const v = (anomaly - shift) * scale;
    const t = Math.abs(v);

    const { blues, reds, invalid } = this.palette;

    if (anomaly === null || !Number.isFinite(v)) {
      return invalid;
    }
    const colors = v > 0 ? reds : blues;
    if (t > 1.0) {
      return colors[colors.length - 1];
    }
    const idxLo = Math.floor(t * (colors.length - 1));
    const idxHi = Math.ceil(t * (colors.length - 1));
    const u = t * (colors.length - 1) - idxLo;

    return colors[idxLo].mix(colors[idxHi], u);
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
