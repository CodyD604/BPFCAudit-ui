import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { pluralize } from 'ember-inflector';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api';

  // @ts-expect-error ts expects type to be of model name
  pathForType(type: string) {
    return pluralize(type);
  }
}
