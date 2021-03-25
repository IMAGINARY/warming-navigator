import random from 'lodash.random';
import Color from 'color';

import { warmingNavigator as defaultOptions } from '../options/defaultOptions';

import palettes from '../palettes';
import ShowRYSelector from '../region-year-selector/show-r-y-selector';
import ShowValidRYSelector from '../region-year-selector/show-valid-r-y-selector';
import AdjustToValidRYSelector from '../region-year-selector/adjust-to-valid-r-y-selector';
import Keyboard from '../input/keyboard';
import Wheel from '../input/wheel';

function assert(cond, key, value, types) {
  if (!cond) {
    const msg = `Invalid option: ${key}=${value}. (Wanted: ${types})`;
    throw new Error(msg);
  }
}

function propertyOrInt(options, optionKey, obj) {
  const optionValue = options[optionKey];

  if (typeof obj[optionValue] !== 'undefined') return obj[optionValue];

  const num = Number.parseInt(optionValue, 10);
  if (Number.isFinite(num)) return num;

  assert(false, optionKey, optionValue, ['<Integer>', ...Object.keys(obj)]);

  return null;
}

function processInitialRegion(data, options) {
  return propertyOrInt(options, 'initialRegion', {
    first: 0,
    last: data.regions.length - 1,
    random: random(0, data.regions.length - 1),
  });
}

function processMinYear(data, options) {
  return propertyOrInt(options, 'minYear', {
    data: data.yearRange[0],
    valid: data.validYearRange[0],
  });
}

function processMaxYear(data, options) {
  return propertyOrInt(options, 'maxYear', {
    data: data.yearRange[1],
    valid: data.validYearRange[1],
  });
}

function processInitialYear(minYear, maxYear, options) {
  const initialYears = {
    first: minYear,
    last: maxYear,
    random: random(minYear, maxYear),
  };
  return propertyOrInt(options, 'initialYear', initialYears);
}

function processLanguage(data, options) {
  assert(
    data.languages.includes(options.lang),
    'lang',
    options.lang,
    data.languages
  );
  return options.lang;
}

function processPalette(options) {
  const { blues, reds, invalid } = palettes[options.palette];
  return {
    blues: blues.map((hex) => Color(hex)),
    reds: reds.map((hex) => Color(hex)),
    invalid: Color(invalid),
  };
}

function processElement(options) {
  const element =
    options.element instanceof Element
      ? options.element
      : document.querySelector(options.element);

  assert(element !== null, 'element', options.element, [
    '<Element>',
    '<query selector string>',
  ]);

  return element;
}

function processRYSelector(options) {
  const rySelectorClasses = {
    'show': ShowRYSelector,
    'show-valid': ShowValidRYSelector,
    'adjust-to-valid': AdjustToValidRYSelector,
  };
  const RYSelectorClass = rySelectorClasses[options.invalidYear];
  assert(
    typeof RYSelectorClass !== 'undefined',
    'invalidYear',
    options.invalidYear,
    Object.keys(rySelectorClasses)
  );
  return RYSelectorClass;
}

function processInputs(options) {
  const inputs = [];
  if (options.keyboard) {
    inputs.push(new Keyboard(options));
  }
  if (options.wheel) {
    inputs.push(new Wheel(options));
  }
  return inputs;
}

function processOther(data, options) {
  // Just to make it explicit which options are used
  return {
    sort: options.sort,
    singleCellView: options.singleCellView,
    gridView: options.gridView,
  };
}

export default function processOptions(data, optionsNoDefaults) {
  const options = {
    ...defaultOptions,
    ...optionsNoDefaults,
  };

  const initialRegion = processInitialRegion(data, options);
  const minYear = processMinYear(data, options);
  const maxYear = processMaxYear(data, options);
  const initialYear = processInitialYear(minYear, maxYear, options);

  const language = processLanguage(data, options);
  const palette = processPalette(options);
  const element = processElement(options);
  const RYSelectorClass = processRYSelector(options);
  const inputs = processInputs(options);

  const { sort, singleCellView, gridView } = processOther(data, options);

  return {
    initialRegion,
    minYear,
    maxYear,
    initialYear,

    language,
    palette,
    element,
    RYSelectorClass,
    inputs,

    sort,
    singleCellView,
    gridView,
  };
}
