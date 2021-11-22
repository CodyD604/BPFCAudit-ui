import Component from '@glimmer/component';
import AuditModel from 'bpfcaudit-ui/models/audit';
import { action } from '@ember/object';

interface AuditSelectButtonArgs {
  onClick(audit: AuditModel | null): void;
  record: AuditModel;
}

export default class AuditSelectButton extends Component<AuditSelectButtonArgs> {
  get isDisabled() {
    return this.args.record.status == 'SUCCESSFUL';
  }

  @action
  onClick() {
    if (this.args.onClick) {
      this.args.onClick(this.args.record);
    }
  }
}
