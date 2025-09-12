const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const logRoutes = require('./routes/logs');
const aiRoutes = require('./routes/ai');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/logs', logRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'DevOps AI Agent API', 
    status: 'Running',
    endpoints: {
      health: '/health',
      logs: '/api/logs',
      metrics: '/api/reports/metrics'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`DevOps AI Agent API running on port ${PORT}`);
});