import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Service ${i + 1}`;
  },

  afterCreate(service, server) {
    server.createList('audit', 10, { service });
    server.create('policy', { service });
  },
});
