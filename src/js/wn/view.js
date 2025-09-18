import Colorizer from './colorizer';

export default class View {
  constructor(model, rySelector, language, palette) {
    this.model = model;
    this.rYSelector = rySelector;
    this.language = language;
    this.colorizer = new Colorizer(palette);
  }

  getModel() {
    return this.model;
  }

  getRYSelector() {
    return this.rYSelector;
  }

  getLanguage() {
    return this.language;
  }

  getColorizer() {
    return this.colorizer;
  }

  formatAnomaly(anomaly) {
    if (Number.isFinite(anomaly)) {
      const formatterOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
      const formatter = new Intl.NumberFormat(
        this.getLanguage(),
        formatterOptions,
      );
      return `${anomaly < 0 ? '' : '+'}${formatter.format(anomaly)}°C`;
    }
    return '   ? °C';
  }

  formatUncertainty(uncertainty) {
    if (Number.isFinite(uncertainty)) {
      const formatterOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
      const formatter = new Intl.NumberFormat(
        this.getLanguage(),
        formatterOptions,
      );
      return `±${formatter.format(uncertainty)}°C`;
    }
    return '±  ? °C';
  }
}
