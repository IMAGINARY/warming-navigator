import ready from 'document-ready';

import WarmingNavigator from './warming-navigator';
import Keyboard from './input/keyboard';
import Wheel from './input/wheel';

async function fetchData() {
  const response = await fetch('./assets/data/data-europe-ext.json');
  const data = await response.json();
  return data;
}

function getOptions() {
  const searchParams = new URLSearchParams(window.location.search);
  const options = Object.fromEntries(searchParams.entries());
  return options;
}

async function main() {
  const options = getOptions();

  const data = await fetchData();
  const el = document.querySelector('.warming-navigator');
  const wn = new WarmingNavigator(el, data, options);

  const keyboard = new Keyboard();
  keyboard.attach(wn);

  const wheel = new Wheel();
  wheel.attach(wn);
}

ready(main);
