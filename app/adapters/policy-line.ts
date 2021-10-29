import ApplicationAdapter from 'bpfcaudit-ui/adapters/application';

interface QueryArgs {
  policy: string;
}

export default class PolicyLine extends ApplicationAdapter {
  pathForType() {
    return 'analyzePolicy';
  }

  query(_store: any, _type: string, query: QueryArgs) {
    const url = this.buildURL('policy-line');
    return this.ajax(url, 'POST', { data: query });
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    'policy-line': PolicyLine;
  }
}
