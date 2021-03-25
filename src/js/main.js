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

  const wnOptions = { ...options };
  if (options.singleCellView) {
    wnOptions.element = document.querySelector('#warming-navigator');
  }
  if (options.gridView) {
    wnOptions.gridViewElement = document.querySelector('#anomaly-table');
  }

  const wn = new WarmingNavigator(data, wnOptions);
  global.warmingNavigator = wn;
}

ready(main);
