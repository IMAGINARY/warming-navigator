const { readFile } = require('fs').promises;
const assert = require('assert');
const readTemperatureFile = require('./read-temperature-file');

const max = (arr) => arr.reduce((acc, cur) => Math.max(acc, cur));
const sum = (arr) => arr.reduce((acc, cur) => acc + cur, 0.0);
const mean = (arr) => sum(arr) / arr.length;
const sigma = (arr, meanOfArr = mean(arr)) =>
  mean(arr.map((a) => (a - meanOfArr) ** 2));
const yearInRange = (minYear, maxYear) => (d) =>
  d.year >= minYear && d.year <= maxYear;
const filterYears = (arr, minYear, maxYear) =>
  arr.filter(yearInRange(minYear, maxYear));
const getAnomalies = (arr) => arr.map((d) => d.anomaly);
const cleanup = (arr) => arr.filter((v) => Number.isFinite(v));

function analyzeAnomalies(annualData, minYear, maxYear) {
  const anomaliesForYears = cleanup(
    getAnomalies(filterYears(annualData, minYear, maxYear))
  );
  const anomaliesMean = mean(anomaliesForYears);
  const anomaliesSigma = sigma(anomaliesForYears, anomaliesMean);
  const anomaliesStdDev = anomaliesSigma ** 0.5;
  const valid = anomaliesForYears.length / (maxYear - minYear + 1);

  return {
    mean: anomaliesMean,
    sigma: anomaliesSigma,
    stdDev: anomaliesStdDev,
    valid,
  };
}

async function warmingStripeData(url) {
  const temperatureData = await readTemperatureFile(url);

  // June is the reference month for each year. Note that Date uses the month index 0-11, not 1-12.
  const refMonthIndex = 5;
  const annualData = temperatureData.content
    .filter((d) => d.date.getMonth() === refMonthIndex)
    .sort((a, b) => a.year - b.year)
    .map((d) => ({
      year: d.date.getFullYear(),
      anomaly: Number.isFinite(d.annual_value) ? d.annual_value : null,
      unc: Number.isFinite(d.annual_unc) ? d.annual_unc : null,
    }));

  annualData.forEach((v, i) =>
    assert(
      v.year === annualData[0].year + i,
      `The temperature record contains duplicate or missing data for the reference month (June) in year ${v.year}.`
    )
  );

  annualData.forEach((v) =>
    assert(
      (typeof v.anomaly === 'number' && Number.isFinite(v.anomaly)) ||
        v.anomaly === null,
      `Temperature anomaly for ${v.year} must be a finite number or null, but is ${v.anomaly}.`
    )
  );

  annualData.forEach((v) =>
    assert(
      (typeof v.unc === 'number' && Number.isFinite(v.unc)) || v.unc === null,
      `Temperature anomaly uncertainty for ${v.year} must be a finite number or null, but is ${v.unc}.`
    )
  );

  const xor = (a, b) => (a && !b) || (!a && b);
  annualData.forEach((v) =>
    assert(
      !xor(Number.isFinite(v.anomaly), Number.isFinite(v.unc)),
      `Temperature anomaly and uncertainty for ${v.year} must both be valid or invalid.`
    )
  );

  delete temperatureData.content;
  const meta = { ...temperatureData };

  const firstYear = annualData[0].year;
  const anomalies = annualData.map((d) => d.anomaly);
  const uncertainties = annualData.map((d) => d.unc);
  const lastInvalidIndex = anomalies.lastIndexOf(null);
  const minValidYear =
    lastInvalidIndex !== -1 ? annualData[lastInvalidIndex].year + 1 : firstYear;
  const maxValidYear = annualData[annualData.length - 1].year;
  const validYearRange = [minValidYear, maxValidYear];
  assert(
    minValidYear <= maxValidYear,
    `At least the data for the most recent year must be valid. Valid year range: ${validYearRange}.`
  );

  const { mean: mean1971To2000 } = analyzeAnomalies(annualData, 1971, 2000);
  const { mean: mean1901To2000, stdDev: stdDev1901To2000 } = analyzeAnomalies(
    annualData,
    1901,
    2000
  );

  assert(
    stdDev1901To2000 > 0.0,
    `Standard deviation must be > 0, but is ${stdDev1901To2000}.`
  );

  const maxDev = max(
    cleanup(anomalies).map(
      (a) => Math.abs(a - mean1901To2000) / stdDev1901To2000
    )
  );

  const maxStdDev = maxDev < 2.6 ? 2.6 : maxDev;

  const shift = mean1971To2000;
  const scale = 1 / (stdDev1901To2000 * maxStdDev);

  const wsd = {
    meta,
    firstYear,
    validYearRange,
    shift,
    scale,
    anomalies,
    uncertainties,
  };

  return wsd;
}

async function loadConfig(configPath) {
  const buffer = await readFile(configPath);
  const text = await buffer.toString();
  const config = JSON.parse(text);
  return config;
}

async function main(configPath) {
  const config = await loadConfig(configPath);
  const regions = await Promise.all(
    config.regions.map(async (region) => {
      const wsd = await warmingStripeData(region.url);
      console.error(region);
      return {
        ...region,
        ...wsd,
      };
    })
  );

  const yearRange = regions.reduce(
    (acc, cur) => [
      Math.min(acc[0], cur.validYearRange[0]),
      Math.max(acc[1], cur.validYearRange[1]),
    ],
    [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
  );
  const validYearRange = regions.reduce(
    (acc, cur) => [
      Math.max(acc[0], cur.validYearRange[0]),
      Math.min(acc[1], cur.validYearRange[1]),
    ],
    [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]
  );
  const wsd = { yearRange, validYearRange, regions };
  console.log(JSON.stringify(wsd, null, 2));
}

assert(process.argv.length > 2, 'Path to JSON config file required.');
main(process.argv[2]).then();
