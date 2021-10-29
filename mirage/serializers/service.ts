import ApplicationSerializer from './application';
import ServiceMeta from '../../app/types/service-meta';
import _ from 'lodash';

export default ApplicationSerializer.extend({
  serialize() {
    const json = ApplicationSerializer.prototype.serialize.apply(
      this,
      // eslint-disable-next-line prefer-rest-params
      arguments
    );

    // Add metadata
    const meta: ServiceMeta = {};
    if (json.included) {
      let lastAudit: string;

      json.included.forEach((obj) => {
        if (obj.type == 'audits') {
          if (
            !lastAudit ||
            Date.parse(lastAudit) < Date.parse(obj.attributes.endTime)
          ) {
            lastAudit = obj.attributes.endTime;
          }
        }
      });

      if (lastAudit) {
        meta.lastAudit = lastAudit;
      }
    }

    if (!_.isEmpty(meta)) {
      json.meta = meta;
    }

    return json;
  },
});
