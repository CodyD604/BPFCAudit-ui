import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

export default class Services extends Controller {
  @service store!: Store;
  fetchServicesTask: any;
  serviceModelForCreation = {};
  @tracked isServiceCreatorOpen = false;

  @action
  auditCreatorClick() {
    this.isServiceCreatorOpen = true;
  }

  @action
  auditCreatorHidden() {
    this.isServiceCreatorOpen = false;
  }

  @action
  onServiceCreateSubmit() {
    this.isServiceCreatorOpen = false;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    services: Services;
  }
}
