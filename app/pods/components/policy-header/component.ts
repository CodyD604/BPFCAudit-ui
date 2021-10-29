import Component from '@glimmer/component';
import PolicyModel from 'bpfcaudit-ui/models/policy';
import PolicyLineMeta from 'bpfcaudit-ui/types/policy-line-meta';

interface PolicyHeaderArgs {
  policy?: PolicyModel;
  policyLineMeta?: PolicyLineMeta;
  coversOtherRules?: boolean;
}

export default class PolicyHeader extends Component<PolicyHeaderArgs> {
  get policySubtitle() {
    if (this.args.policyLineMeta) {
      return this.args.policyLineMeta.eventTotal + ' events';
    }

    return 'No event data';
  }

  get policyName() {
    if (this.args.policy) {
      return this.args.policy.get('name');
    } else if (this.args.coversOtherRules) {
      return 'Other events';
    } else {
      return 'No policy loaded';
    }
  }
}
