export const main = {
  dataset: 'europe-ext', // <string>
  sort: true, // <boolean>
  keyboard: true, // <boolean>
  wheel: false, // <boolean>
  singleCellView: true, // <boolean>
  gridView: false, // <boolean>
};

export const warmingNavigator = {
  lang: 'en',
  minYear: 'valid', // 'data', 'valid', <number>
  maxYear: 'data', // 'data', 'valid', <number>
  invalidYear: 'show', // 'show', 'show-valid', 'adjust-to-valid'
  initialYear: 'random', // 'first', 'last', 'random', <number>
  initialRegion: 'random', // 'first', 'last', 'random', <number>
  palette: 'edHawkins', // see ../palettes.js
};

export const keyboard = {
  prevRegionKey: 'ArrowLeft',
  nextRegionKey: 'ArrowRight',
  prevYearKey: 'ArrowDown',
  nextYearKey: 'ArrowUp',
};

export const wheel = {
  wheelDelta: 53,
  wheelInvertX: false,
  wheelInvertY: false,
  wheelRegionHorYearVert: true,
};
