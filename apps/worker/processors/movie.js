async function processMovie(job) {
  console.log('[movie] Processing job', job.id, job.data);
  // TODO: movie processing logic
  return { done: true, queue: 'movie' };
}

module.exports = processMovie;
