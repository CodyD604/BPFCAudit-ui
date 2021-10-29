import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import ServiceMeta from 'bpfcaudit-ui/types/service-meta';

export default class ServiceModel extends Model {
  @attr() name!: string;
  // Assigned in the serializer if applicable. There is probably a better way to do this.
  @attr() meta?: ServiceMeta;
  @belongsTo('policy', { async: false }) policy?: any; // TODO: type relationships
  @hasMany('audit', { async: false }) audits?: any[]; // TODO: type relationships
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    service: ServiceModel;
  }
}
