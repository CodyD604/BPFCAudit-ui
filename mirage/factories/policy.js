import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Policy ${i + 1}`;
  },

  policyContent(i) {
    if (i % 3 === 0) {
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
    } else if (i % 3 === 1) {
      return `name: httpd
      cmd: 'httpd'
      defaultTaint: false
      
      allow:
        # /dev/urandom, /dev/random, /dev/null
        - dev: random
        - dev: null
      
        # Access to log files
        - file: {pathname: /var/log/httpd, access: rw}
        - file: {pathname: /var/log/httpd/*log, access: ra}
      
        # Create pidfile, delete or modify an existing pid file if necessary
        - file: {pathname: /run/httpd, access: rw}
        - file: {pathname: /run/httpd/**/*, access: rwd}
      
        # Read configuration
        - file: {pathname: /usr/share/httpd/**/*, access: r}
        - file: {pathname: /etc/httpd, access: r}
        - file: {pathname: /etc/httpd/conf/**/*, access: r}
        - file: {pathname: /usr/share/zoneinfo/**/*, access: r}
      
        # Serve files
        - file: {pathname: /srv, access: r}
        - file: {pathname: /srv/html, access: r}
        - file: {pathname: /srv/html/**, access: r}
      
        # Read hostname information
        - file: {pathname: /etc/resolv.conf, access: r}
        - file: {pathname: /etc/host*, access: r}
      
        # Shared libraries loaded at runtime
        - file: {pathname: /usr/lib/httpd/modules/*.so, access: mr}
        - file: {pathname: /usr/lib/libnss*.so.*, access: mr}
        - file: {pathname: /usr/lib/libgcc_s.so.*, access: mr}
      
        # Execute suexec and python
        - file: {pathname: /usr/bin/suexec, access: rx}
        - file: {pathname: /usr/bin/python, access: rx}
      
        # Shared libraries required for suexec and python
        # This is unfortunately required since BPFContain currently
        # has no notion of untainting like BPFBox
        - file: {pathname: /usr/lib/libpython*.so.*, access: mr}
        - file: {pathname: /usr/lib/libc.so.*, access: mr}
        - file: {pathname: /usr/lib/libpthread.so.*, access: mr}
        - file: {pathname: /usr/lib/libdl.so.*, access: mr}
        - file: {pathname: /usr/lib/libutil.so.*, access: mr}
        - file: {pathname: /usr/lib/libm.so.*, access: mr}
        - file: {pathname: /usr/lib64/ld-linux-x86-64.so.*, access: mr}
      
        # Allow ipc with mysql
        - ipc: mysqld
      
        # Allow sending signals to existing httpd instances
        - signal: {to: httpd, signals: [check, superFatal]}
      
        # Bind to privileged ports, change uid and gid
        - capability: [netBindService, setUID, setGID]
      
        # Use networking
        - net: [server, send, recv]
      
      taint:
        # Taint when performing any ipc or networking
        - net: [send, recv]
        - ipc: mysqld`;
    } else {
      return `# A unique name for the policy file, REQUIRED
      name: foo
      # The command to run, REQUIRED
      cmd: /bin/foo
      # Should the container spawn tainted, regardless of taint rules?
      defaultTaint: false
      
      # A set of rights to grant, OPTIONAL
      rights:
        # Grants read/write/append access to /dev/pts/* devices
        - dev: terminal
        # Grants read access to /dev/[u]random
        - dev: random
        # Grants readonly access to devices with major number 12
        - numberedDevice: {major: 12, access: readOnly}
        # Grants read-only access to /dev/**
        - fs: {path: /dev, access: readOnly}
        # Grants read-only access to /**
        - fs: {path: /, access: readOnly}
        # Grants access to CAP_DAC_OVERRIDE and CAP_DAC_READ_SEARCH
        - capability: [dacOverride, dacReadSearch]
        # Grants ipc access with the policy named bar (this must be mutually granted by bar)
        - ipc: bar
        # Grants client send/recv access
        - net: [client, send, recv]
      
      # A set of restrictions (rights to explicitly revoke), OPTIONAL
      restrictions:
        # Explicitly denies write/append access to /**
        - fs: {path: /, access: wa}
        # Explicitly deny server network operations
        - net: server
      
      # A set of taint rules (which trigger BPFContain to start enforcing), OPTIONAL
      # If no taint rules are specified, the policy will start tained by default
      taints:
        # Taint on any net access
        - net: any
        # Taint on ipc access with bar
        - ipc: bar
      
      # Note: If you're not tainting by default, you should always specify
      # read/execute access to the executable and read/exec-mmap access to any
      # required libraries`;
    }
  },
});
