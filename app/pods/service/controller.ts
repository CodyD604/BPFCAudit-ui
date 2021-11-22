import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import AuditModel from 'bpfcaudit-ui/models/audit';

export default class Service extends Controller {
  queryParams = ['auditId'];
  fetchServiceTask: any;
  @tracked auditId: string | null = null;
  @tracked isAuditSelectorOpen = false;
  @tracked isServiceEditorOpen = false;

  @action
  onSelectAudit(audit: AuditModel | null) {
    if (audit) {
      this.auditId = audit.id;
    }
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
  serviceEditClick() {
    this.isServiceEditorOpen = true;
  }

  @action
  serviceEditorHidden() {
    this.isServiceEditorOpen = false;
  }

  @action
  onServiceUpdateSubmit() {
    this.isServiceEditorOpen = false;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    service: Service;
  }
}
