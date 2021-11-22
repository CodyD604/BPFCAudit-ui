import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import ServiceModel from 'bpfcaudit-ui/models/service';
import { inject as service } from '@ember/service';
import { Router } from '@ember/routing';
import AuditModel from 'bpfcaudit-ui/models/audit';

interface ServiceHeaderArgs {
  model: ServiceModel;
  onSelectAudit: (audit: AuditModel | null) => void;
  fetchServiceTask: any;
}

export default class ServiceHeader extends Component<ServiceHeaderArgs> {
  @service router!: Router;
  @tracked isAuditSelectorOpen = false;

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

  get audits() {
    return this.args.model.audits;
  }

  get fetchServiceTask() {
    return this.args.fetchServiceTask;
  }

  get serviceId() {
    return this.args.model.id;
  }

  @action
  backButtonClick() {
    this.router.transitionTo('services');
  }

  @action
  auditSelectorClick() {
    this.isAuditSelectorOpen = true;
  }

  @action
  auditSelectorHidden() {
    this.isAuditSelectorOpen = false;
  }

  @action
  onSelectAudit(audit: AuditModel) {
    if (this.args.onSelectAudit) {
      this.args.onSelectAudit(audit);
    }
  }
}
