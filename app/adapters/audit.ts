/* eslint-disable @typescript-eslint/no-unused-vars */
import ApplicationAdapter from 'bpfcaudit-ui/adapters/application';
import RSVP from 'rsvp';
import Store from '@ember-data/store';

// @ts-expect-error test
interface CreateRecordArgs {
  auditId: string;
  endTime: string;
}

export default class Audit extends ApplicationAdapter {
  createRecord(_store: Store, _type: string, snapshot: any): RSVP.Promise<any> {
    const url = this.buildURL('audit');
    return this.ajax(url, 'POST', {
      data: {
        type: 'audits',
        // TODO: better way to access create parameters?
        attributes: {
          endTime: snapshot._attributes.endTime,
          serviceId: snapshot._attributes.serviceId,
        },
      },
    });
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    audit: Audit;
  }
}
