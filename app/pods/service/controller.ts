import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import AuditModel from 'bpfcaudit-ui/models/audit';

export default class Service extends Controller {
  queryParams = ['auditId'];
  fetchServiceTask: any;
  @tracked auditId: string | null = null;

  @action
  onSelectAudit(audit: AuditModel | null) {
    if (audit) {
      this.auditId = audit.id;
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    service: Service;
  }
}
