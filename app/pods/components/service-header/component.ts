import { action } from '@ember/object';
import Component from '@glimmer/component';
import ServiceModel from 'bpfcaudit-ui/models/service';
import { inject as service } from '@ember/service';
import { Router } from '@ember/routing';
import AuditModel from 'bpfcaudit-ui/models/audit';

interface ServiceHeaderArgs {
  model: ServiceModel;
  onSelectAudit: (audit: AuditModel | null) => void;
  auditSelectorClick: () => void;
  serviceEditClick: () => void;
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

  @action
  auditSelectorClick() {
    if (this.args.auditSelectorClick) {
      this.args.auditSelectorClick();
    }
  }

  @action
  serviceEditClick() {
    if (this.args.serviceEditClick) {
      this.args.serviceEditClick();
    }
  }
}
