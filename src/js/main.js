import ready from 'document-ready';

import getOptions from './options';

import WarmingNavigator from './warming-navigator';
import Keyboard from './input/keyboard';
import Wheel from './input/wheel';

async function fetchData() {
  const response = await fetch('./assets/data/data-europe-ext.json');
  const data = await response.json();
  return data;
}

async function main() {
  const options = getOptions();
  const {
    mainOptions,
    warmingNavigatorOptions,
    keyboardOptions,
    wheelOptions,
  } = options;
  console.log(options);

  const data = await fetchData();
  const el = document.querySelector('.warming-navigator');
  const wn = new WarmingNavigator(el, data, warmingNavigatorOptions);

  const keyboard = new Keyboard(keyboardOptions);
  keyboard.attach(wn);

  const wheel = new Wheel(wheelOptions);
  wheel.attach(wn);
}

ready(main);
