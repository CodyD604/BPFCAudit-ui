import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { restartableTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { taskFor } from 'ember-concurrency-ts';

export default class Service extends Route {
  POLLING_INTERVAL = 30000; // 30 seconds

  queryParams = {
    auditId: {
      refreshModel: true,
    },
  };

  // TODO: there might be a better way to get the ids for the task
  @tracked serviceId: string | null = null;
  @tracked auditId: string | null = null;

  setupController(controller: Controller, model: any, transition: any) {
    super.setupController(controller, model, transition);
    controller.setProperties({
      // @ts-expect-error TODO: fix typing
      fetchServiceTask: this.getService,
    });
  }

  model(params: any) {
    this.serviceId = params.service_id;
    this.auditId = params.auditId;
    const model = taskFor(this.getService).perform();
    taskFor(this.pollForServiceChanges).perform();
    return model;
  }

  @restartableTask
  *getService() {
    // @ts-expect-error TODO: fix TS weirdness with yield
    const service = yield this.store.findRecord('service', this.serviceId, {
      include: 'audits,policy',
    });

    const auditId = this.auditId;

    if (service && service.policy && auditId) {
      const policyLines = this.store.query('policy-line', {
        policy: service.policy.policyContent,
        auditId,
      });

      return RSVP.hash({
        service,
        policyLines,
      });
    }

    return RSVP.hash({
      service,
    });
  }

  @restartableTask
  *pollForServiceChanges() {
    try {
      while (true) {
        yield this.delay(this.POLLING_INTERVAL);
        // @ts-expect-error TS doesn't know about perform
        yield this.getService.perform();
      }
    } finally {
      // TODO: remove
      console.log(`Done polling.`);
    }
  }

  // TODO: there is probably an existing method out there that does this
  delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
}
