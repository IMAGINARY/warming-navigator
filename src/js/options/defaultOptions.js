export const main = {
  dataset: 'europe-ext', // <string>
  sort: true, // <boolean>
  keyboard: true, // <boolean>
  wheel: false, // <boolean>
  singleCellView: true, // <boolean>
  gridView: false, // <boolean>
};

export const warmingNavigator = {
  lang: 'en', // <string>
  minYear: 'valid', // 'data', 'valid', <number>
  maxYear: 'data', // 'data', 'valid', <number>
  invalidYear: 'show', // 'show', 'show-valid', 'adjust-to-valid'
  initialYear: 'random', // 'first', 'last', 'random', <number>
  initialRegion: 'random', // 'first', 'last', 'random', <number>
  palette: 'edHawkins', // see ../palettes.js
};

export const keyboard = {
  prevRegionKey: 'ArrowLeft', // <string>
  nextRegionKey: 'ArrowRight', // <string>
  prevYearKey: 'ArrowDown', // <string>
  nextYearKey: 'ArrowUp', // <string>
};

export const wheel = {
  wheelDelta: 53, // <number>
  wheelInvertX: false, // <boolean>
  wheelInvertY: false, // <boolean>
  wheelRegionHorYearVert: true, // <boolean>
};
