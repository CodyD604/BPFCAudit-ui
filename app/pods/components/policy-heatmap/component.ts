/* eslint-disable prefer-rest-params */
import Component from '@glimmer/component';
// @ts-expect-error no typing available for rainbowvis
import Rainbow from 'rainbowvis.js';
import PolicyModel from 'bpfcaudit-ui/models/policy';
import PolicyLine from 'bpfcaudit-ui/models/policy-line';
import PolicyLineMeta from 'bpfcaudit-ui/types/policy-line-meta';
import { abbreviateNumber } from 'js-abbreviation-number';

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
    const eventDataByLine: Record<string, number> = {};

    if (this.args.policyLines) {
      this.args.policyLines.forEach((policyLine) => {
        if (policyLine.includedByPolicy) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          eventDataByLine[policyLine.lineNumber!.toString()] =
            policyLine.eventCount;
        }
      });
    }

    return eventDataByLine;
  }

  get policyByLine() {
    const eventDataByLine = this.eventDataByLine;
    const colourSpectrum = this.colourSpectrum;

    // User-provided policy
    if (this.args.policy) {
      return this.args.policy
        .get('policyContent')
        .split(/\r?\n/)
        .map((value, index) => {
          const eventCount = eventDataByLine[index];
          let heatColour = '212529'; // Black by default
          let eventCountStr = null;

          if (eventCount) {
            eventCountStr = abbreviateNumber(eventCount, 0);
            heatColour = colourSpectrum.colourAt(eventCount);
          }

          return {
            content: value,
            eventCount: eventCountStr,
            heatColour,
          };
        });
    }
    // Default policy lines
    else {
      if (this.args.policyLines) {
        return this.args.policyLines
          .filter((policyLine) => !policyLine.includedByPolicy)
          .map((policyLine) => {
            return {
              content: policyLine.line,
              eventCount: abbreviateNumber(policyLine.eventCount, 0),
              heatColour: colourSpectrum.colourAt(policyLine.eventCount),
            };
          });
      }
    }
    return [];
  }
}
