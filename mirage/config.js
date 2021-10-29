import faker from 'faker';

/* eslint-disable ember/no-get */
export default function () {
  this.namespace = 'bpfca/api/v1';

  this.get('/services');
  this.get('/services/:id');
  this.post('/analyzePolicy', (_schema, request) => {
    const requestData = JSON.parse(request.requestBody);
    const policyLines = requestData.policy.split('\n');
    const annotatedLines = [];
    const eventCountUpperBound = 10 ** 6;
    var maxEventCount = 0;
    var minEventCount = eventCountUpperBound;
    var eventTotal = 0;

    policyLines.forEach((line, index) => {
      var lineToAdd = {
        id: faker.datatype.uuid(),
        type: 'policyLine',
        attributes: {
          line: line,
          lineNumber: index,
          includedByPolicy: true,
          eventCount: null,
        },
      };

      if (line.trim().charAt(0) == '-') {
        const eventCount = faker.datatype.number(eventCountUpperBound);

        lineToAdd.attributes.eventCount = eventCount;
        eventTotal += eventCount;

        if (eventCount > maxEventCount) {
          maxEventCount = eventCount;
        }

        if (eventCount < minEventCount) {
          minEventCount = eventCount;
        }
      }

      annotatedLines.push(lineToAdd);
    });

    return {
      data: annotatedLines,
      meta: { maxEventCount, minEventCount, eventTotal },
    };
  });
}
