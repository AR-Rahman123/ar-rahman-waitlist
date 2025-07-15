const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.post('/api/waitlist', async (req, res) => {
  console.log('Waitlist submission received:', req.body);
  res.json({ success: true, message: "Successfully joined waitlist!" });
});

app.get('/api/waitlist/count', async (req, res) => {
  res.json({ count: 11 });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports.handler = serverless(app);