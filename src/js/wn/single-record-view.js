import View from './view';

export default class SingleRecordView extends View {
  constructor(element, model, rySelector, language, palette) {
    super(model, rySelector, language, palette);
    this.element =
      element instanceof Element ? element : document.querySelector(element);
    this.regionElement = this.element.querySelector('.region');
    this.yearElement = this.element.querySelector('.year');
    this.anomalyElement = this.element.querySelector('.anomaly');
    this.uncertaintyElement = this.element.querySelector('.uncertainty');
    this.update();
  }

  update() {
    const model = this.getModel();
    const year = this.getRYSelector().getYearToShow() + model.getMinYear();
    const region = this.getRYSelector().getRegion();
    const title = model.getTitle(region);
    const { anomaly, relativeAnomaly, uncertainty } = model.getRecord(
      region,
      year,
    );
    const color = this.getColorizer().hex(relativeAnomaly);
    this.displayRecord(title, year, anomaly, uncertainty, color);
  }

  displayRecord(title, year, anomaly, uncertainty, color) {
    this.regionElement.innerText = title;
    this.yearElement.innerText = year;
    this.anomalyElement.innerText = this.formatAnomaly(anomaly);
    this.uncertaintyElement.innerText = this.formatUncertainty(uncertainty);
    this.element.style.backgroundColor = color;
  }
}
