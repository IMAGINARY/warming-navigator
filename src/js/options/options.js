import pickBy from 'lodash.pickby';
import mapValues from 'lodash.mapvalues';

import * as defaultOptions from './defaultOptions';
import * as optionParsers from './optionParsers';

function collision(...objs) {
  const keys = [].concat(...objs.map((o) => Object.keys(o)));
  const counter = Object.fromEntries(keys.map((k) => [k, 0]));
  // eslint-disable-next-line no-return-assign
  keys.forEach((k) => (counter[k] += 1));
  return Object.entries(counter)
    .filter(([, count]) => count > 1)
    .map(([key]) => key);
}

const collidingDefaultOptions = collision(Object.values(defaultOptions));
if (collidingDefaultOptions.length > 0) {
  throw new Error(
    `Colliding default options detected: ${collidingDefaultOptions}`
  );
}

function checkParserAvailability() {
  Object.entries(defaultOptions).forEach(([key1, value1]) => {
    Object.keys(value1).forEach((key2) => {
      if (typeof optionParsers?.[key1][key2] !== 'function') {
        throw new Error(`Missing parser for option ${key1}.${key2}`);
      }
    });
  });
}

checkParserAvailability();

function sanitize(obj, sanitizerObj) {
  return pickBy(obj, (v, k) => typeof sanitizerObj[k] !== 'undefined');
}

export function getDefaultOptions() {
  return Object.assign({}, ...Object.values(defaultOptions));
}

export function getOptions(withDefaults = true) {
  const searchParams = new URLSearchParams(window.location.search);
  const rawOptions = Object.fromEntries(searchParams.entries());

  const categorizedOptions = mapValues(defaultOptions, (v1, k1) =>
    mapValues(sanitize(rawOptions, v1), (v2, k2) => optionParsers[k1][k2](v2))
  );

  // merge all options together
  return Object.assign(
    withDefaults ? getDefaultOptions() : {},
    ...Object.values(categorizedOptions)
  );
}
