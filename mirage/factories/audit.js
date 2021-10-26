import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  status: 'SUCCESSFUL',

  startTime() {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    const maxDate = new Date();
    maxDate.setHours(maxDate.getHours() - 1);
    return faker.date.between(minDate, maxDate);
  },

  endTime() {
    const maxDate = new Date(this.startTime);
    maxDate.setHours(maxDate.getHours() + 1);
    return faker.date.between(this.startTime, maxDate);
  },

  completionMessage: 'Audit successful.',
});
