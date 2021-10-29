import EmberRouter from '@ember/routing/router';
import config from 'bpfcaudit-ui/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('services');
  this.route('service', { path: '/service/:service_id' });
});
