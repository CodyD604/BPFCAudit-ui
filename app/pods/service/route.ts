import Route from '@ember/routing/route';

export default class Service extends Route {
  model(params: any) {
    return this.store.findRecord('service', params.service_id, {
      include: 'audits,policy',
    });
  }
}
