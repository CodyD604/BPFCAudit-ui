import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Service ${i}`;
  },

  afterCreate(service, server) {
    server.createList('audit', 3, { service });
  },
});
