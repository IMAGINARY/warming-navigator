import ready from 'document-ready';

import { getOptions, getDefaultOptions } from './options/options';

import WarmingNavigator from './wn/warming-navigator';

async function fetchData(dataset) {
  const response = await fetch(`./assets/data/${dataset}.json`);
  const data = await response.json();
  return data;
}

async function main() {
  const options = getOptions(true);
  // eslint-disable-next-line no-console
  console.log({ options, defaults: getDefaultOptions() });

  const { dataset } = options;
  const data = await fetchData(dataset);

  const element = document.querySelector('#warming-navigator');
  const wn = new WarmingNavigator(data, { ...options, element });

  global.warmingNavigator = wn;
}

ready(main);
