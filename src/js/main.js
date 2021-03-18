import ready from 'document-ready';

function mixColor(c1, c2, t) {
  return Array(3)
    .fill(0)
    .map((_, i) => (1 - t) * c1[i] + t * c2[i]);
}

class WarmingNavigator {
  constructor(element, data) {
    this.element =
      element instanceof Element ? element : document.querySelector(element);
    this.regionElement = this.element.querySelector('.region');
    this.yearElement = this.element.querySelector('.year');
    this.anomalyElement = this.element.querySelector('.anomaly');
    this.uncertaintyElement = this.element.querySelector('.uncertainty');
    this.data = data;
    const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));
    this.regionIndex = getRandomInt(data.regions.length);
    this.yearRange = data.yearRange;
    [, this.year] = this.yearRange;
    this.language = 'en';
    this._update();
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
    return this.regionIndex;
  }

  getYear() {
    return this.year;
  }

  setRegion(index) {
    this.regionIndex = index;
    this._update();
  }

  setYear(year) {
    this.year = year;
    this._update();
  }

  prevRegion() {
    this.setRegion(
      (this.data.regions.length + this.getRegion() - 1) %
        this.data.regions.length
    );
  }

  nextRegion() {
    this.setRegion((this.getRegion() + 1) % this.data.regions.length);
  }

  prevYear() {
    this.setYear(
      this.getYear() === this.yearRange[0]
        ? this.yearRange[1]
        : this.getYear() - 1
    );
  }

  nextYear() {
    this.setYear(
      this.getYear() === this.yearRange[1]
        ? this.yearRange[0]
        : this.getYear() + 1
    );
  }

  setYearRange(min, max) {
    this.yearRange = [min, max];
    this.setYear(Math.max(min, Math.min(this.getYear(), max)));
  }

  _update() {
    const { region, year, anomaly, uncertainty, color } = this._getRecord(
      this.regionIndex,
      this.year
    );
    this._displayRecord(region, year, anomaly, uncertainty, color);
  }
}

async function fetchData() {
  const response = await fetch('./assets/data/data-europe-ext.json');
  const data = await response.json();
  return data;
}

const redrawComplete = true;

async function main() {
  const data = await fetchData();
  const maxUnc = []
    .concat(...data.regions.map((r) => r.uncertainties))
    .filter((u) => Number.isFinite(u))
    .sort()
    .reverse();
  console.log(maxUnc);
  const wn = new WarmingNavigator(
    document.querySelector('.warming-navigator'),
    data
  );
  wn.setYearRange(data.validYearRange[0], data.yearRange[1]);
  document.addEventListener('keydown', (event) => {
    if (redrawComplete) {
      switch (event.key) {
        case 'ArrowLeft':
          wn.prevRegion();
          break;
        case 'ArrowRight':
          wn.nextRegion();
          break;
        case 'ArrowDown':
          wn.prevYear();
          break;
        case 'ArrowUp':
          wn.nextYear();
          break;
        default:
          break;
      }
      //      redrawComplete = false;
      //      requestAnimationFrame(() => {redrawComplete=true;});
    }
  });
  let deltaX = 0;
  let deltaY = 0;
  const stepX = 53.0;
  const stepY = 53;
  document.addEventListener('wheel', (event) => {
    if (event.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
      deltaX += event.deltaX;
      deltaY += event.deltaY;
      console.log({ deltaX, deltaY, event });
      while (deltaX <= -stepX) {
        wn.prevRegion();
        deltaX += stepX;
      }
      while (deltaX >= stepX) {
        wn.nextRegion();
        deltaX -= stepX;
      }
      while (deltaY <= -stepY) {
        wn.prevYear();
        deltaY += stepY;
      }
      while (deltaY >= stepY) {
        wn.nextYear();
        deltaY -= stepY;
      }
    } else {
      console.log(event);
    }
  });
}

ready(main);
