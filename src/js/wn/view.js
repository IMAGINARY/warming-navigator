import EventEmitter from 'events';

import Colorizer from './colorizer';

export default class View extends EventEmitter {
  constructor(element, model, rySelector, language, palette) {
    super();
    this.element =
      element instanceof Element ? element : document.querySelector(element);
    this.regionElement = this.element.querySelector('.region');
    this.yearElement = this.element.querySelector('.year');
    this.anomalyElement = this.element.querySelector('.anomaly');
    this.uncertaintyElement = this.element.querySelector('.uncertainty');
    this.model = model;
    this.rYSelector = rySelector;
    this.language = language;
    this.colorizer = new Colorizer(palette);
    this.update();
  }

  update() {
    const year = this.rYSelector.getYearToShow() + this.model.getMinYear();
    const region = this.rYSelector.getRegion();
    const title = this.model.getTitle(region);
    const { anomaly, relativeAnomaly, uncertainty } = this.model.getRecord(
      region,
      year
    );
    const color = this.colorizer.hex(relativeAnomaly);
    this.displayRecord(title, year, anomaly, uncertainty, color);
  }

  formatAnomaly(anomaly) {
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

  formatUncertainty(uncertainty) {
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

  displayRecord(title, year, anomaly, uncertainty, color) {
    this.regionElement.innerText = title;
    this.yearElement.innerText = year;
    this.anomalyElement.innerText = this.formatAnomaly(anomaly);
    this.uncertaintyElement.innerText = this.formatUncertainty(uncertainty);
    this.element.style.backgroundColor = color;
  }
}
