import Model, { attr, belongsTo } from '@ember-data/model';

export default class PolicyModel extends Model {
  @attr() name!: string;
  @attr() policyContent!: string;
  @belongsTo('service') service: any;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    policy: PolicyModel;
  }
}
