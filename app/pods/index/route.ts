import Route from '@ember/routing/route';

export default class Index extends Route {
  redirect() {
    this.transitionTo('services');
  }
}
