import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '../.env' });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // Enable pre-flight for all routes
app.use(express.json());

// Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/transactions', transactionRoutes);


// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling Middleware
app.use((req, res, next) => {
  res.status(404).json({ error: `Path ${req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Admin Backend Server running on port ${PORT}`);
  });
}

export default app;
