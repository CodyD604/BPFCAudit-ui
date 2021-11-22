import Component from '@glimmer/component';
import PolicyModel from 'bpfcaudit-ui/models/policy';
import PolicyLineMeta from 'bpfcaudit-ui/types/policy-line-meta';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ServiceModel from 'bpfcaudit-ui/models/service';
import { taskFor } from 'ember-concurrency-ts';

interface PolicyHeaderArgs {
  service: ServiceModel;
  policy?: PolicyModel;
  policyLineMeta?: PolicyLineMeta;
  coversOtherRules?: boolean;
  policyChangeClick: () => void;
  policyChangeOnSubmit: () => void;
  fetchPoliciesTask: any;
}

export default class PolicyHeader extends Component<PolicyHeaderArgs> {
  @tracked isPolicyChangeOpen = false;

  get representsPolicy() {
    return !this.args.coversOtherRules;
  }

  get policySubtitle() {
    if (this.args.policyLineMeta) {
      if (this.args.coversOtherRules) {
        return this.args.policyLineMeta.defaultPolicyEventTotal + ' events';
      } else {
        return this.args.policyLineMeta.includedByPolicyEventTotal + ' events';
      }
    }

    return 'No event data';
  }

  get policyName() {
    if (this.representsPolicy && this.args.policy) {
      return this.args.policy.get('name');
    } else if (this.args.coversOtherRules) {
      return 'Other events';
    } else {
      return 'No policy loaded';
    }
  }

  get service() {
    return this.args.service;
  }

  get serviceId() {
    return this.service.id;
  }

  get fetchPoliciesTask() {
    return this.args.fetchPoliciesTask;
  }

  get policyChangeOnSubmit() {
    return this.args.policyChangeOnSubmit;
  }

  @action
  policyChangeClick() {
    this.isPolicyChangeOpen = true;
    taskFor(this.args.fetchPoliciesTask).perform();
  }

  @action
  policyChangeHidden() {
    this.isPolicyChangeOpen = false;
  }
}
