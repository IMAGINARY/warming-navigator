# Warming navigator

A wep app to explore surface temperature anomalies of certain regions and years.

Developed by IMAGINARY for the 10-minute museum on mathematical modelling of the climate crisis.

## Configuration

The exhibit is configured via URL parameters, i.e. `index.html?key1=value2&key2=value2&...`. The following options are
valid:

- `dataset` (`<string>`, default: `'europe-ext'`): The .json file in assets/data containing the warming anomaly data.
- `lang` (`<string>`, default: `'en'`): Language of the region titles. Must match a language code in the dataset.
- `sort` (`<boolean>`, default: `true`): Sort the data by region name in the current language.
- `keyboard` (`<boolean>`, default: `true`): Navigate via keyboard.
- `wheel` (`<boolean>`, default: `false`): Navigate via the mouse wheel and trackpad.
- `singleCellView` (`<boolean>`, default: `true`): Enable a view showing only the current region and year.
- `gridView` (`<boolean>`, default: `false`): Enable a view showing all data in a grid (for debugging).
- `minYear` (`'data'`, `'valid'`, `<number>`, default: `'valid'`): The first year to show in the views. If `'data'`, the
  first year of the dataset is used. If `'valid'`, the first year considered valid in the dataset is used. If `<number>`
  , use that year.
- `maxYear` (`'data'`, `'valid'`, `<number>`, default: `'data'`): The last year to show in the views. If `'data'`, the
  last year of the dataset is used. If `'valid'`, the last year considered valid in the dataset is used. If `<number>`,
  use that year.
- `invalidYear` (`'show'`, `'show-valid'`, `'adjust-to-valid'`, default: `'show'`): How to deal with invalid/missing
  data. If `'show'`, the temperature anomaly (and uncertainty) is replaced by a placeholder. If `'show-valid'`, an
  earlier or later year with valid data is shown, but the year selected by the user is not changed when the region is
  adjusted. If `adjust-to-valid`, an earlier or later year wit valid data is selected, changing the year selection
  permanently.
- `initialYear` (`'first'`, `'last'`, `'random'`, `<number>`, default: `'random'`): The year that is used when the app
  starts.
- `initialRegion` (`'first'`, `'last'`, `'random'`, `<number>`, default: `'random'`): The region that is used when the
  app starts. Note that the region index is with respect to the order in the dataset.
- `palette` (`'berkeleyEarth'`, `'edHawkins'`, default: `'edHawkins'`): Temperature anomaly color palette.
  See `/src/js/palettes.js`.
- `highContrast` (`<boolean>`, default: `false`): Invert text brightness for dark temperature anomaly colors.
- `prevRegionKey` (`<string>`, [JS key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values),
  default: `'ArrowLeft'`): Key that selects the previous region.
- `nextRegionKey` (`<string>`, [JS key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values),
  default: `'ArrowRight''`): Key that selects the next region.
- `prevYearKey` (`<string>`, [JS key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values),
  default: `'ArrowDown'`): Key that selects the previous year.
- `nextYearKey` (`<string>`, [JS key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values),
  default: `'ArrowUp'`): Key that selects the previous region.
- `wheelDelta` (`<number>`, default: `53`): Number of wheel steps necessary before changing the region respectively
  year (platform and browser dependent).
- `wheelInvertX` (`<boolean>`, default: `false`): Whether to invert the horizontal wheel axis.
- `wheelInvertY` (`<boolean>`, default: `false`): Whether to invert the vertical wheel axis.
- `wheelRegionHorYearVert` (`<boolean>`, default: `true`): Whether to use the horizontal wheel direction for the region
  and the vertical wheel direction for the year or vice versa.

## Station setup

For setting up this exhibit on a Raspberry Pi 3B+, please follow the [setup guide](station/README.md).

## Building and development

You will need `node` and `npm` installed on your system.

To install dependencies, run:

```shell
npm install
```

To build the project into the `dist` folder, run:

```shell
npm run build
```

To start a development server with automatic reloading, run:

```shell
npm run dev
```

### Generating datasets

Datasets are generated from raw temperature anomaly retrieved from [Berkeley Earth](http://berkeleyearth.lbl.gov). The
selection of which raw data files to use is made in `.json` config files located in `/src/json`. The
dataset `/assets/data/<dataset>.json` is generated based on `/src/json/config-<dataset>.json`. The config file format is
as follows:

```json5
{
  regions: [
    {
      title: {
        lngA: 'Region 0 title in language A',
        lngB: 'Region 0 title in language B',
      },
      url: 'http://...',
    },
    {
      title: {
        lngA: 'Region 1 title in language A',
        lngB: 'Region 1 title in language B',
      },
      url: 'http://...',
    },
    // ... more regions ...
  ],
}
```

The links to the raw data files can be found at the temperature anomaly page of a certain region, e.g.
for [Germany](http://berkeleyearth.lbl.gov/regions/germany), the raw data file
is [this](http://berkeleyearth.lbl.gov/auto/Regional/TAVG/Text/germany-TAVG-Trend.txt).

After editing one of the config files, re-run `npm run data` to regenerate all datasets included in the repository.
In order to only regenerate a single `<dataset>`, you can also run :

```shell
node ./src/js/data-generator/main.js 'path-to/config-<dataset>.json' > 'public/data/<dataset>.json'
```

Rebuilding the project will then include the updated dataset into the `dist` folder.

## Credits

Developed by [Christian Stussak](https://github.com/porst17) for [IMAGINARY gGmbH](https://www.imaginary.org).

## License

### Source code

Copyright 2025 [IMAGINARY gGmbH](https://www.imaginary.org)

Licensed under the Apache License, Version 2.0 (see `LICENSE`).

### Temperature anomaly data

The datasets are generated from the [Creative Commons BY-4.0](https://creativecommons.org/licenses/by/4.0/) licensed
temperature anomaly data available at [Berkeley Earth](http://berkeleyearth.lbl.gov). For a precise list of raw data
files this project builds upon, see the `.json` files in `/src/json`.
