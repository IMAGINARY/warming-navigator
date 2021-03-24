import processOptions from './option-processor';

import Model from './model';
import View from './view';
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

    const view = new View(element, model, rySelector, language, palette);
    const controller = new Controller(model, rySelector, view, inputs);

    Object.assign(this, {
      model,
      view,
      controller,
    });
  }
}
