/* eslint-disable ember/no-get */
export default function () {
  this.namespace = 'api';

  this.get('/services');
  this.get('/services/:id');
  this.post('/audits');
}
