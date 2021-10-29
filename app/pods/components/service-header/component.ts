import { action } from '@ember/object';
import Component from '@glimmer/component';
import ServiceModel from 'bpfcaudit-ui/models/service';
import { inject as service } from '@ember/service';
import { Router } from '@ember/routing';

interface ServiceHeaderArgs {
  model: ServiceModel;
}

export default class ServiceHeader extends Component<ServiceHeaderArgs> {
  @service router!: Router;

  get meta() {
    return this.args.model.meta;
  }

  get serviceName() {
    if (this.args.model) {
      return this.args.model.name;
    }
    return 'No service found';
  }

  get eventsLastCaptured() {
    if (this.meta && this.meta.lastAudit) {
      return (
        'Service last audited at ' + this.args.model.meta?.lastAudit // TODO: format date to user's local time
      );
    }
    return 'Service not yet audited';
  }

  @action
  backButtonClick() {
    this.router.transitionTo('services');
  }
}
