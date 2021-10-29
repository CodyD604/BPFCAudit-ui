import Route from '@ember/routing/route';

export default class Services extends Route {
  model() {
    // TODO: pagination?
    return this.store.findAll('service');
  }
}
