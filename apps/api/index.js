const express = require('express');
const { Queue } = require('bullmq');

const connection = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
};

const app = express();
app.use(express.json());

const movieQueue = new Queue('movie', { connection });
const imageQueue = new Queue('image', { connection });

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/movies', async (req, res) => {
  try {
    const job = await movieQueue.add('create', req.body || {});
    res.status(202).json({ id: job.id, queue: 'movie' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/images', async (req, res) => {
  try {
    const job = await imageQueue.add('create', req.body || {});
    res.status(202).json({ id: job.id, queue: 'image' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
