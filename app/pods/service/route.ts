import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class Service extends Route {
  // TODO: polling, do not block for policy analysis

  async model(params: any) {
    const service = await this.store.findRecord('service', params.service_id, {
      include: 'audits,policy',
    });

    if (service && service.policy) {
      const policyLines = this.store.query('policy-line', {
        policy: service.policy.policyContent,
      });

      return RSVP.hash({
        service: service,
        policyLines: policyLines,
      });
    }

    return RSVP.hash({
      service: service,
    });
  }
}
