import pickBy from 'lodash.pickby';

import * as defaultOptions from './defaultOptions';

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

function sanitize(obj, sanitizerObj) {
  return pickBy(obj, (v, k) => typeof sanitizerObj[k] !== 'undefined');
}

export default function getOptions() {
  const searchParams = new URLSearchParams(window.location.search);
  const options = Object.fromEntries(searchParams.entries());

  return Object.fromEntries(
    Object.keys(defaultOptions).map((key) => [
      `${key}Options`,
      sanitize(options, defaultOptions[key]),
    ])
  );
}
