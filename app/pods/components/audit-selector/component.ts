import Component from '@glimmer/component';
import { action } from '@ember/object';
import AuditModel from 'bpfcaudit-ui/models/audit';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { taskFor } from 'ember-concurrency-ts';

interface AuditSelectorArgs {
  isOpen: boolean;
  onHide: () => void;
  onSelectAudit: (audit: AuditModel | null) => void;
  audits: AuditModel[];
  fetchServiceTask: any;
  serviceId: string;
}

export default class AuditSelector extends Component<AuditSelectorArgs> {
  @service store!: Store;

  get columns() {
    return [
      {
        propertyName: 'status',
        title: 'Status',
      },
      {
        propertyName: 'completionMessage',
        title: 'Completion Message',
      },
      {
        propertyName: 'startTime',
        title: 'Start Time',
      },
      {
        propertyName: 'endTime',
        title: 'End Time',
      },
      {
        component: 'selectRow',
        title: 'Select',
      },
    ];
  }

  get isOpen() {
    return this.args.isOpen;
  }

  get audits() {
    return this.args.audits;
  }

  get noAudits() {
    return !this.audits || this.audits.length == 0;
  }

  @action
  onHidden() {
    this.args.onHide();
  }

  @action
  onSelectAudit(audit: AuditModel | null) {
    if (this.args.onSelectAudit) {
      this.args.onSelectAudit(audit);
    }
  }

  @action
  onRunAudit() {
    const secondsFromNowToEndAudit = parseInt(
      // @ts-expect-error TODO: there is probably a more "Ember" way to get the value from the input
      document.getElementById('time-to-run').value
    );

    const endTime = new Date();
    endTime.setSeconds(endTime.getSeconds() + secondsFromNowToEndAudit);

    this.store
      .createRecord('audit', {
        serviceId: this.args.serviceId,
        endTime: endTime.toISOString(),
      })
      .save()
      // TODO: investigate why catch occurs (this is why we use finally)
      .finally(() => {
        taskFor(this.args.fetchServiceTask).perform();
      });
  }
}
