import ready from 'document-ready';

import * as defaultOptions from './options/defaultOptions';

import { getOptions } from './options/options';

import WarmingNavigator from './warming-navigator';
import Keyboard from './input/keyboard';
import Wheel from './input/wheel';

async function fetchData(dataset) {
  const response = await fetch(`./assets/data/${dataset}.json`);
  const data = await response.json();
  return data;
}

function sortData(data, language) {
  data.regions.sort((ra, rb) =>
    String(ra?.title[language]).localeCompare(rb?.title[language])
  );
}

async function main() {
  const options = getOptions();
  const mainOptions = { ...defaultOptions.main, ...options.main };
  console.log({ options, defaults: defaultOptions });

  const data = await fetchData(mainOptions.dataset);
  if (mainOptions.sort) {
    const lang =
      options.warmingNavigator.lang ?? defaultOptions.warmingNavigator.lang;
    sortData(data, lang);
  }

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
