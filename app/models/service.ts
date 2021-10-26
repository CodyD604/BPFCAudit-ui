import Model, { attr, hasMany } from '@ember-data/model';

export default class ServiceModel extends Model {
  @attr() name!: string;
  @hasMany('audit') audits!: any[];
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    service: ServiceModel;
  }
}
