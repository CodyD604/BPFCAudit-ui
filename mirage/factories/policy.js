import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Policy ${i + 1}`;
  },

  policyContent() {
    return `# A unique name for the policy file, REQUIRED
    name: bash
    # The command to run
    cmd: /bin/bash
    # Should the container spawn tainted, regardless of taint rules?
    defaultTaint: false
    
    # A set of rights to grant, OPTIONAL
    allow:
      - device: terminal
      - device: null
      - fs: {pathname: /, access: rxm}
      - fs: {pathname: /proc, access: r}
    
    # A set of restrictions (rights to explicitly revoke), OPTIONAL
    deny:
      - fs: {path: /, access: wa}
    
    taint:
      - fs: {path: /tmp, access: wa}`;
  },
});
