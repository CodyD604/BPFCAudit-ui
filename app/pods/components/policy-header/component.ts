import Component from '@glimmer/component';
import PolicyModel from 'bpfcaudit-ui/models/policy';

interface PolicyHeaderArgs {
  policy?: PolicyModel;
  coversOtherRules?: boolean;
}

export default class PolicyHeader extends Component<PolicyHeaderArgs> {
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
