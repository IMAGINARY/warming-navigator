export default class Colorizer {
  constructor(palette) {
    this.palette = palette;
  }

  hex(relativeAnomaly) {
    return this.get(relativeAnomaly).hex();
  }

  get(relativeAnomaly) {
    const v = relativeAnomaly;
    const t = Math.abs(v);

    const { blues, reds, invalid } = this.palette;

    if (v === null || !Number.isFinite(v)) {
      return invalid;
    }
    const colors = v > 0 ? reds : blues;
    if (t > 1.0) {
      return colors[colors.length - 1];
    }
    const idxLo = Math.floor(t * (colors.length - 1));
    const idxHi = Math.ceil(t * (colors.length - 1));
    const u = t * (colors.length - 1) - idxLo;

    return colors[idxLo].mix(colors[idxHi], u);
  }
}
