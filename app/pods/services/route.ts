import Route from '@ember/routing/route';
import { restartableTask } from 'ember-concurrency';
import pollTask from 'bpfcaudit-ui/utils/pollTask';
import { taskFor } from 'ember-concurrency-ts';
import Controller from '@ember/controller';

export default class Services extends Route {
  setupController(controller: Controller, model: any, transition: any) {
    super.setupController(controller, model, transition);
    controller.setProperties({
      // @ts-expect-error TODO: fix typing
      fetchServicesTask: this.getServices,
    });
  }

  model() {
    // TODO: pagination?
    return taskFor(this.getServices).perform();
  }

  @restartableTask
  *getServices() {
    // @ts-expect-error TODO: fix ts weirdness with yield
    return yield this.store.findAll('service');
  }

  // TODO: would ideally not create a new polling function each time
  @restartableTask
  pollForServiceChanges() {
    return pollTask(this.getServices);
  }
}
