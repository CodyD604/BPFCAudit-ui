/* eslint-disable prefer-rest-params */
import Component from '@glimmer/component';
// @ts-expect-error no typing available for rainbowvis
import Rainbow from 'rainbowvis.js';
import PolicyModel from 'bpfcaudit-ui/models/policy';
import PolicyLine from 'bpfcaudit-ui/models/policy-line';
import PolicyLineMeta from 'bpfcaudit-ui/types/policy-line-meta';

interface PolicyHeatmapArgs {
  policy?: PolicyModel;
  policyLines?: PolicyLine[];
}

export default class PolicyHeatmap extends Component<PolicyHeatmapArgs> {
  rainbow = new Rainbow();

  constructor() {
    // @ts-expect-error TODO remove along with prefer rest params
    super(...arguments);
    this.rainbow.setSpectrum('blue', 'yellow', 'red');
  }

  get policyLineMeta(): PolicyLineMeta | null {
    if (this.args.policyLines) {
      // @ts-expect-error need to fix typing of policyLines
      return this.args.policyLines.meta;
    }
    return null;
  }

  get colourSpectrum() {
    const policyLineMeta = this.policyLineMeta;

    if (policyLineMeta) {
      this.rainbow.setNumberRange(
        policyLineMeta.minEventCount,
        policyLineMeta.maxEventCount
      );
    }

    return this.rainbow;
  }

  get eventDataByLine() {
    const eventDataByLine: Record<string, any> = {};

    if (this.args.policyLines) {
      this.args.policyLines.forEach((value) => {
        if (value.includedByPolicy) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          eventDataByLine[value.lineNumber!.toString()] = value.eventCount;
        }
      });
    }

    return eventDataByLine;
  }

  get policyByLine() {
    if (this.args.policy) {
      const eventDataByLine = this.eventDataByLine;
      const colourSpectrum = this.colourSpectrum;

      return this.args.policy
        .get('policyContent')
        .split(/\r?\n/)
        .map((value, index) => {
          const eventCount = eventDataByLine[index];
          let heatColour = '212529'; // Black by default
          let eventCountStr = '';

          if (eventCount) {
            eventCountStr = '(' + eventCount + ')';
            heatColour = colourSpectrum.colourAt(eventCount);
          }

          return {
            content: value,
            eventCount: eventCountStr,
            heatColour,
          };
        });
    }

    return [];
  }
}
