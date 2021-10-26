import { camelize } from '@ember/string';
import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  keyForAttribute(attr) {
    return camelize(attr);
  },
});
