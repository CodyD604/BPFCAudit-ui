import faker from 'faker';

/* eslint-disable ember/no-get */
export default function () {
  this.namespace = 'bpfca/api/v1';

  this.get('/services');
  this.post('/services');
  this.get('/services/:id');
  this.patch('/services/:id', function (schema, request) {
    const requestData = JSON.parse(request.requestBody);

    const id = request.params.id;
    const service = schema.services.find(id);

    if (
      requestData.data.relationships &&
      requestData.data.relationships.policy
    ) {
      service.policyId = requestData.data.relationships.policy.data.id;
      service.save();
    }

    let attrs = this.normalizedRequestAttrs();
    return service.update(attrs);
  });
  this.get('/policies');
  this.post('/audits', (schema, request) => {
    const requestData = JSON.parse(request.requestBody);
    const attributes = requestData.data.attributes;

    // Create audit
    const auditAttrs = {
      status: 'IN_PROGRESS',
      completionMessage: 'Audit in progress.',
      startTime: new Date().toISOString(),
      endTime: attributes.endTime,
    };
    const audit = schema.db.audits.insert(auditAttrs);

    // Add audit id to service
    const service = schema.services.find(attributes.serviceId);
    service.auditIds.push(audit.id);
    schema.db.services.update(service.id, { auditIds: service.auditIds });
  });
  this.post('/analyzePolicy', (_schema, request) => {
    const requestData = JSON.parse(request.requestBody);
    const eventCountUpperBound = 10 ** 6;
    var countMeta = {
      maxEventCount: 0,
      minEventCount: eventCountUpperBound,
    };
    const annotatedLines = [];

    const policyAnalysis = annotateLines(
      requestData.policy,
      eventCountUpperBound,
      countMeta,
      true,
      annotatedLines
    );

    const defaultPolicyLines = `- capability: [setUID]\n- net: server`;

    const defaultPolicyAnalysis = annotateLines(
      defaultPolicyLines,
      eventCountUpperBound,
      countMeta,
      false,
      annotatedLines
    );

    return {
      data: annotatedLines,
      meta: {
        ...countMeta,
        includedByPolicyEventTotal: policyAnalysis.eventTotal,
        defaultPolicyEventTotal: defaultPolicyAnalysis.eventTotal,
      },
    };
  });
}

// Split up lines of the policy into annotated lines (policy-line models)
function annotateLines(
  policy, // Raw policy
  eventCountUpperBound, // How high event counts can go
  countMeta, // Largest/smallest event count seen thus far
  includedByPolicy,
  annotatedLines
) {
  const policyLines = policy.split('\n');
  var eventTotal = 0;

  policyLines.forEach((line, index) => {
    var lineToAdd = {
      id: faker.datatype.uuid(),
      type: 'policyLine',
      attributes: {
        line: line,
        lineNumber: index,
        includedByPolicy,
        eventCount: null,
      },
    };

    if (line.trim().charAt(0) == '-') {
      const eventCount = faker.datatype.number(eventCountUpperBound);

      lineToAdd.attributes.eventCount = eventCount;
      eventTotal += eventCount;

      if (eventCount > countMeta.maxEventCount) {
        countMeta.maxEventCount = eventCount;
      }

      if (eventCount < countMeta.minEventCount) {
        countMeta.minEventCount = eventCount;
      }
    }

    annotatedLines.push(lineToAdd);
  });

  return { eventTotal };
}
