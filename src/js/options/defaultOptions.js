export const main = {
  sort: true, // <boolean>
  keyboard: true, // <boolean>
  wheel: false, // <boolean>
};

export const warmingNavigator = {
  lang: 'en',
  minYear: 'valid', // 'data', 'valid', <number>
  maxYear: 'data', // 'data', 'valid', <number>
  invalidYear: 'show', // 'show', 'show-valid', 'adjust-to-valid'
  initialYear: 'random', // 'first', 'last', 'random', <number>
  initialRegion: 'random', // 'first', 'last', 'random', <number>
};

export const keyboard = {
  prevRegionKey: 'ArrowLeft',
  nextRegionKey: 'ArrowRight',
  prevYearKey: 'ArrowDown',
  nextYearKey: 'ArrowUp',
};

export const wheel = {
  delta: 53,
  invertX: false,
  invertY: false,
  regionHorYearVert: true,
};