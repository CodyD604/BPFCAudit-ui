/* eslint-disable prefer-rest-params */
import Component from '@glimmer/component';
// @ts-expect-error no typing available for rainbowvis
import Rainbow from 'rainbowvis.js';
import PolicyModel from 'bpfcaudit-ui/models/policy';

interface PolicyHeatmapArgs {
  policy?: PolicyModel;
}

export default class PolicyHeatmap extends Component<PolicyHeatmapArgs> {
  value = Math.floor(Math.random() * 100);
  rainbow = new Rainbow();

  constructor() {
    // @ts-expect-error TODO remove along with prefer rest params
    super(...arguments);

    this.rainbow.setSpectrum('blue', 'yellow', 'red');
  }

  get colour() {
    return this.rainbow.colourAt(this.value);
  }

  get policyByLine() {
    if (this.args.policy) {
      return this.args.policy.get('policyContent').split(/\r?\n/);
    } else {
      return [];
    }
  }
}
