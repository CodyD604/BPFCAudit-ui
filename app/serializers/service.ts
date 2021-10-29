import ApplicationSerializer from 'bpfcaudit-ui/serializers/application';

export default class ServiceSerializer extends ApplicationSerializer {
  // TODO: just use spread operator on arguments (right now linter/TS freak out)
  normalizeResponse(
    store: any,
    primaryModelClass: any,
    payload: any,
    id: any,
    requestType: any
  ) {
    payload.data.attributes.meta = payload.meta;
    return super.normalizeResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType
    );
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    service: ServiceSerializer;
  }
}
