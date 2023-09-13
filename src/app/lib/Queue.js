import Queue from 'bull';

import * as queues from '../queues';
import * as jobs from '../jobs';

const allQueues = Object.values(queues).map(queue => ({
  bull: new Queue(queue.name, { redis: queue.options.redis, settings: { stalledInterval: 0 } }),
}));

const allJobs = Object.values(jobs);

export default {
  addJob: async (type, data) => {
    const job = allJobs.find(j => j.type === type);
    const queue = allQueues.find(q => q.bull.name === job.queue);

    if (job.options === undefined) job.options = {};
    if (data.options) job.options = data.options;

    delete data.options;

    const { id: jobId } = await queue.bull.add(data, job.options);
    // console.log("jobId", jobId)
    return jobId;
  },
  process: () => {
    allJobs.forEach(j => {
      const queue = allQueues.find(q => q.bull.name === j.queue);
      queue.bull.process(j.handle);

      queue.bull.on('failed', (job, err) => {
        const id = new Date().getTime();
        console.log(`Job failed (${ id }): `, job.queue, job.data);
        console.log(`Error (${ id }): `, err);
      });
    });
  },
  removeJob: async (type, jobId) => {
    const job = allJobs.find(j => j.type === type);
    const queue = allQueues.find(q => q.bull.name === job.queue);

    queue.bull.removeJobs(jobId);
  }
}
