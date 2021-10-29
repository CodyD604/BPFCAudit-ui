import Model, { attr } from '@ember-data/model';

export default class PolicyLine extends Model {
  @attr() line!: string;
  @attr() lineNumber?: number;
  @attr() includedByPolicy!: boolean;
  @attr() eventCount!: number;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'policy-line': PolicyLine;
  }
}
