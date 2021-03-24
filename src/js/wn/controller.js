export default class Controller {
  constructor(model, rySelector, view, inputs) {
    this.model = model;
    this.view = view;
    this.rySelector = rySelector;
    this.inputs = inputs;

    inputs.forEach((input) => {
      input.on('decrease-region', () => this.rySelector.prevRegion());
      input.on('increase-region', () => this.rySelector.nextRegion());
      input.on('decrease-year', () => this.rySelector.prevYear());
      input.on('increase-year', () => this.rySelector.nextYear());
    });

    console.log(rySelector);

    rySelector.on('changed', () => this.view.update());
  }
}
