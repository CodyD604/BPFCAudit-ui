// @ts-expect-error no typing available for rainbowvis
import Rainbow from 'rainbowvis.js';

export default class HeatColourProvider {
  rainbow: any;

  constructor(maxEventCount: number) {
    this.rainbow = new Rainbow();
    this.rainbow.setSpectrum('blue', 'yellow', 'red');
    this.rainbow.setNumberRange(0, maxEventCount);
  }

  getColour(value: number) {
    return this.rainbow.colourAt(value);
  }
}
