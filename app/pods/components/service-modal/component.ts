import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import ServiceModel from 'bpfcaudit-ui/models/service';
import { taskFor } from 'ember-concurrency-ts';

interface ServiceModalArgs {
  isOpen: boolean;
  onHide: () => void;
  onSubmit: () => void;
  service: ServiceModel | null;
  isCreating: boolean;
  fetchServiceTask: any;
}

export default class ServiceModal extends Component<ServiceModalArgs> {
  @service store!: Store;

  get service() {
    return this.args.service;
  }

  get isCreating() {
    return this.args.isCreating;
  }

  get submitText() {
    if (this.isCreating) return 'Create';
    else return 'Update';
  }

  get modalTitle() {
    if (this.isCreating) return 'Create Service';
    else return 'Update Service';
  }

  get isOpen() {
    return this.args.isOpen;
  }

  @action
  onHidden() {
    this.args.onHide();
  }

  @action
  onSubmit(model: ServiceModel) {
    let savePromise: Promise<any>;

    if (this.isCreating) {
      savePromise = this.store.createRecord('service', model).save();
    } else {
      savePromise = model.save();
    }

    savePromise.then(() => {
      taskFor(this.args.fetchServiceTask).perform();
    });

    if (this.args.onSubmit) {
      this.args.onSubmit();
    }
  }
}
