import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import ServiceModel from 'bpfcaudit-ui/models/service';
import { taskFor, TaskFunction } from 'ember-concurrency-ts';
import { tracked } from '@glimmer/tracking';
import PolicyModel from 'bpfcaudit-ui/models/policy';

interface PolicyModalArgs {
  isOpen: boolean;
  service: ServiceModel;
  onHide: () => void;
  onSubmit: () => void;
  fetchPoliciesTask: TaskFunction;
}

export default class PolicyModal extends Component<PolicyModalArgs> {
  @service store!: Store;
  @tracked selectedPolicyName: string | null =
    this.service.policy?.name ?? null;

  get isOpen() {
    return this.args.isOpen;
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

  get arePoliciesLoading(): boolean {
    return taskFor(this.fetchPoliciesTask).isRunning;
  }

  get policies(): PolicyModel[] | null {
    // @ts-expect-error TODO: better typing for task
    return taskFor(this.fetchPoliciesTask).lastSuccessful.value;
  }

  // Unfortunately need to build a mapping of policy names to ids. Power select may have a better way to do this.
  get policyNameToId() {
    const policyNameToId: Record<string, string> = {};
    if (this.policies) {
      this.policies.forEach((policy) => {
        policyNameToId[policy.name] = policy.id;
      });
    }
    return policyNameToId;
  }

  get policyNames() {
    if (this.policies) {
      return this.policies.map((policy) => policy.name);
    } else {
      return [];
    }
  }

  @action
  onHidden() {
    if (this.args.onHide) {
      this.args.onHide();
    }
  }

  @action
  choosePolicy(policyName: string) {
    this.selectedPolicyName = policyName;
  }

  @action
  onSubmit() {
    if (this.selectedPolicyName) {
      const policyId = this.policyNameToId[this.selectedPolicyName];
      const policy = this.store.peekRecord('policy', policyId);

      this.service.policy = policy;

      this.service.save().then(() => {
        if (this.args.onSubmit) {
          this.args.onSubmit();
        }
      });
    }
  }
}
