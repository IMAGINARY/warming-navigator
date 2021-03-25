import processOptions from './option-processor';

import Model from './model';
import SingleRecordView from './single-record-view';
import GridView from './grid-view';
import Controller from './controller';

export default class WarmingNavigator {
  constructor(data, options) {
    this.data = data;
    this.processedOptions = processOptions(data, options);
    const {
      initialRegion,
      minYear,
      maxYear,
      initialYear,

      language,
      palette,
      element,
      RYSelectorClass,
      inputs,
      gridViewElement,

      sort,
    } = this.processedOptions;

    const model = new Model(data, minYear, maxYear, language, sort);

    const rySelector = new RYSelectorClass({
      numRegions: model.getNumRegions(),
      region: initialRegion,
      numYears: model.getNumYears(),
      year: initialYear - minYear,
      validator: (r, y) => model.isValid(r, minYear + y),
    });

    const views = [];
    for (let i = 0; i < 9; i += 1) {
      const wnElem = document.querySelector(`#warming-navigator${i}`);
      const singleRecordView = new SingleRecordView(
        wnElem,
        model,
        rySelector,
        language,
        palette
      );
      views.push(singleRecordView);
      const style = window.getComputedStyle(wnElem);
      wnElem.title = `Font ${i}: ${style.fontFamily}`;
    }

    if (typeof gridViewElement !== 'undefined') {
      const gridView = new GridView(
        gridViewElement,
        model,
        rySelector,
        language,
        palette
      );
      views.push(gridView);
    }

    const controller = new Controller(model, rySelector, views, inputs);

    Object.assign(this, {
      model,
      views,
      controller,
    });
  }
}
