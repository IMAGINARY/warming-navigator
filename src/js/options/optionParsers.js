function parseBoolean(s) {
  if (s === '' || s === 'true' || s === '1') return true;
  if (s === 'false' || s === '0') return false;
  throw TypeError('Expected <boolean>.');
}

function booleanParser() {
  return parseBoolean;
}

function parseInt(s) {
  const i = Number.parseInt(s, 10);
  if (`${i}` === s) {
    return i;
  }
  throw TypeError('Expected <integer>.');
}

function intParser() {
  return parseInt;
}

function parseStrings(s, ...strings) {
  if (strings.includes(s)) {
    return s;
  }
  throw TypeError(`Expected ${strings}`);
}

function stringsParser(...strings) {
  return (s) => parseStrings(s, ...strings);
}

function parseIntOrStrings(s, ...strings) {
  try {
    return parseInt(s);
  } catch (e1) {
    try {
      return parseStrings(s, ...strings);
    } catch (e2) {
      throw TypeError(`Expected <integer> or ${strings}`);
    }
  }
}

function intOrStringsParser(...strings) {
  return (s) => parseIntOrStrings(s, ...strings);
}

function parseString(s) {
  return s;
}

function stringParser() {
  return parseString;
}

const datasetURIRegexp = /[^A-Za-z0-9_-]/;

function parseDataset(s) {
  const match = datasetURIRegexp.exec(s);
  if (match === null) {
    return s;
  }
  throw new TypeError(`Illegal character in dataset name: ${match[0]}`);
}

function datasetParser() {
  return parseDataset;
}

export const main = {
  dataset: datasetParser(),
  sort: booleanParser(),
  keyboard: booleanParser(),
  wheel: booleanParser(),
};

export const warmingNavigator = {
  lang: stringParser(),
  minYear: intOrStringsParser('data', 'valid'),
  maxYear: intOrStringsParser('data', 'valid'),
  invalidYear: stringsParser('show', 'show-valid', 'adjust-to-valid'),
  initialYear: intOrStringsParser('first', 'last', 'random'),
  initialRegion: intOrStringsParser('first', 'last', 'random'),
};

export const keyboard = {
  prevRegionKey: stringParser(),
  nextRegionKey: stringParser(),
  prevYearKey: stringParser(),
  nextYearKey: stringParser(),
};

export const wheel = {
  delta: intParser(),
  invertX: booleanParser(),
  invertY: booleanParser(),
  regionHorYearVert: booleanParser(),
};
