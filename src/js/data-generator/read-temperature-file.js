// eslint-disable-next-line import/no-extraneous-dependencies
global.fetch = require('node-fetch');
// eslint-disable-next-line import/no-extraneous-dependencies
const d3Fetch = require('d3-fetch');
// eslint-disable-next-line import/no-extraneous-dependencies
const d3Dsv = require('d3-dsv');
// eslint-disable-next-line import/no-extraneous-dependencies
const d3TimeFormat = require('d3-time-format');

async function readBasicFile(pth) {
  const text = await d3Fetch.text(pth);
  const rows = text.split('\n');
  const newRows = [];
  const specialData = [];
  let cnt = 0;

  for (let i = 0; i < rows.length; i += 1) {
    if (rows[i].length > 3) {
      if (rows[i].charAt(0) !== '%') {
        const items = rows[i].trim().split(' ');
        const itemsNew = [];
        for (let j = 0; j < items.length; j += 1) {
          if (items[j].length > 0) {
            itemsNew.push(items[j]);
          }
        }
        newRows.push(itemsNew.join(' '));
      } else if (rows[i].charAt(0) === '%' && rows[i].charAt(1) === '%') {
        const items = rows[i].substring(2, rows[i].length).trim().split(':');
        if (items.length === 2) {
          specialData[items[0].trim()] = items[1].trim();
        } else {
          specialData[`Unknown${cnt}`] = items.join(':');
          cnt += 1;
        }
      }
    }
  }
  specialData.content = d3Dsv.dsvFormat(' ').parseRows(newRows.join('\n'));
  return specialData;
}

async function readTemperatureFile(pth) {
  const data = await readBasicFile(pth);

  const { content } = data;
  const newContent = [];

  const dateParser = d3TimeFormat.timeParse('%Y-%m');
  for (let i = 0; i < content.length; i += 1) {
    const date = dateParser(`${content[i][0]}-${content[i][1]}`);
    for (let j = 2; j < content[i].length; j += 1) {
      if (content[i][j] === 'NaN') {
        content[i][j] = null;
      } else {
        content[i][j] = Number(content[i][j]);
      }
    }
    newContent.push({
      date,
      monthly_value: content[i][2],
      monthly_unc: content[i][3],
      annual_value: content[i][4],
      annual_unc: content[i][5],
      five_value: content[i][6],
      five_unc: content[i][7],
      ten_value: content[i][8],
      ten_unc: content[i][9],
      twenty_value: content[i][10],
      twenty_unc: content[i][11],
    });
  }
  data.content = newContent;

  if (
    typeof data['Estimated Jan 1951-Dec 1980 absolute temperature (C)'] !==
    'undefined'
  ) {
    const meanVal =
      data['Estimated Jan 1951-Dec 1980 absolute temperature (C)'].split('+/-');
    data.baseline_value = Number(meanVal[0]);
    data.baseline_unc = Number(meanVal[1]);
  }

  if (typeof data.Unknown0 !== 'undefined') {
    const seasonalString = data.Unknown0.split(' ');
    const seasonalAverages = [];
    for (let i = 0; i < seasonalString.length; i += 1) {
      if (seasonalString[i] !== '') {
        seasonalAverages.push(Number(seasonalString[i]));
      }
    }
    delete data.Unknown0;
    data['Seasonal Averages'] = seasonalAverages;
  }

  if (typeof data.Unknown1 !== 'undefined') {
    const seasonalString = data.Unknown1.split(' ');
    const seasonalUnc = [];
    for (let i = 1; i < seasonalString.length; i += 1) {
      if (seasonalString[i] !== '') {
        seasonalUnc.push(Number(seasonalString[i]));
      }
    }
    delete data.Unknown1;
    data['Seasonal Uncertainty'] = seasonalUnc;
  }

  return data;
}

module.exports = readTemperatureFile;
