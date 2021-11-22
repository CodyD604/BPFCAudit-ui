import Model, { attr, belongsTo } from '@ember-data/model';

export default class AuditModel extends Model {
  @attr() status!: string;
  @attr('date') startTime!: string;
  @attr('date') endTime!: string;
  @attr('date') publishedAt!: string;
  @attr() completionMessage!: string;
  @attr() serviceId!: string; // Used for POST request. There may be a better way.
  @belongsTo('service') service: any;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    audit: AuditModel;
  }
}
