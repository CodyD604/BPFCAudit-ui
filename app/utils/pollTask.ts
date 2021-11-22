import { taskFor } from 'ember-concurrency-ts';

// TODO: find some way to return a task directly. @task annotations cannot be used outside of classes
export default function* pollTask(taskToPoll: any, pollingInterval = 30000) {
  try {
    while (true) {
      yield delay(pollingInterval);
      yield taskFor(taskToPoll).perform();
    }
  } finally {
    // TODO: remove
    console.log(`Done polling.`);
  }
}

// TODO: there is probably an existing method out there that does this
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
