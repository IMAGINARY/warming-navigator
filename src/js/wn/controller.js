export default class Controller {
  constructor(model, rySelector, views, inputs) {
    this.model = model;
    this.views = views;
    this.rySelector = rySelector;
    this.inputs = inputs;

    inputs.forEach((input) => {
      input.on('decrease-region', () => this.rySelector.prevRegion());
      input.on('increase-region', () => this.rySelector.nextRegion());
      input.on('decrease-year', () => this.rySelector.prevYear());
      input.on('increase-year', () => this.rySelector.nextYear());
    });

    rySelector.on('changed', () => this.views.forEach((v) => v.update()));
  }
}
