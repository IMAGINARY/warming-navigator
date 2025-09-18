import View from './view';

export default class GridView extends View {
  constructor(element, model, rySelector, language, palette, highContrast) {
    super(model, rySelector, language, palette);
    this.highContrast = highContrast;
    this.element = element;
    this.region = rySelector.getRegion();
    const minYear = model.getMinYear();
    this.year = minYear + rySelector.getYear();
    this.yearToShow = minYear + rySelector.getYearToShow();
    this.initialize();
    this.update();
  }

  initialize() {
    const model = this.getModel();
    const minYear = model.getMinYear();

    const table = document.createElement('table');

    for (let row = 0; row < this.getModel().getNumYears(); row += 1) {
      const tr = document.createElement('tr');
      for (let col = 0; col < this.getModel().getNumRegions(); col += 1) {
        const td = document.createElement('td');
        const region = col;
        const year = minYear + this.getModel().getNumYears() - 1 - row;
        this.fillTd(td, region, year);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    this.element.appendChild(table);
    this.table = table;
  }

  fillTd(td, region, year) {
    const model = this.getModel();
    const title = model.getTitle(region);
    const { anomaly, relativeAnomaly, uncertainty } = model.getRecord(
      region,
      year,
    );
    const color = this.getColorizer().get(relativeAnomaly);
    const formattedAnomaly = this.formatAnomaly(anomaly);
    const formattedUncertainty = this.formatUncertainty(uncertainty);
    const localTd = td;
    localTd.innerText = formattedAnomaly;
    localTd.style.backgroundColor = color.hex();
    localTd.title = `${title}, ${year}: ${formattedAnomaly} ${formattedUncertainty}`;
    if (this.highContrast && color.isDark()) localTd.classList.add('is-dark');
  }

  getTdElem(region, year) {
    const model = this.getModel();

    const rowIndex = model.getMaxYear() - year + 1;
    const colIndex = region + 1;

    const selector = `tr:nth-child(${rowIndex}) td:nth-child(${colIndex})`;

    return this.table.querySelector(selector);
  }

  addClass(region, year, cssClass) {
    const td = this.getTdElem(region, year);
    td.classList.add(cssClass);
  }

  removeClass(region, year, cssClass) {
    const td = this.getTdElem(region, year);
    td.classList.remove(cssClass);
  }

  update() {
    this.removeClass(this.region, this.year, 'the-year');
    this.removeClass(this.region, this.yearToShow, 'the-year-to-show');

    const model = this.getModel();
    const rySelector = this.getRYSelector();
    const minYear = model.getMinYear();

    this.region = rySelector.getRegion();
    this.year = minYear + rySelector.getYear();
    this.yearToShow = minYear + rySelector.getYearToShow();

    this.addClass(this.region, this.year, 'the-year');
    this.addClass(this.region, this.yearToShow, 'the-year-to-show');
  }
}
