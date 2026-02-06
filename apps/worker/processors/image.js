async function processImage(job) {
  console.log('[image] Processing job', job.id, job.data);
  // TODO: image processing logic
  return { done: true, queue: 'image' };
}

module.exports = processImage;
