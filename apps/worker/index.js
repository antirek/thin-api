const { Worker } = require('bullmq');

const connection = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
};

const queueProcessors = {
  movie: require('./processors/movie'),
  image: require('./processors/image'),
};

const queueArg = process.argv.find((arg) => arg.startsWith('--queue='));
const queueName = queueArg ? queueArg.slice('--queue='.length) : null;

if (!queueName || !queueProcessors[queueName]) {
  console.error('Usage: node index.js --queue=<queue>');
  console.error('Available queues:', Object.keys(queueProcessors).join(', '));
  process.exit(1);
}

const processor = queueProcessors[queueName];
const worker = new Worker(queueName, processor, { connection });

worker.on('completed', (job) => {
  console.log('Job completed', job.id);
});

worker.on('failed', (job, err) => {
  console.error('Job failed', job?.id, err.message);
});

console.log(`Worker "${queueName}" started`);
