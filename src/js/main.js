import ready from 'document-ready';

import * as defaultOptions from './defaultOptions';

import { getOptions } from './options';

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
  const mainOptions = { ...defaultOptions.main, ...options.main };
  console.log({ options, defaults: defaultOptions });

  const data = await fetchData();
  const el = document.querySelector('.warming-navigator');
  const wn = new WarmingNavigator(el, data, options.warmingNavigator);

  if (mainOptions.keyboard) {
    const keyboard = new Keyboard(options.keyboard);
    keyboard.attach(wn);
  }

  if (mainOptions.wheel) {
    const wheel = new Wheel(options.wheel);
    wheel.attach(wn);
  }
}

ready(main);
