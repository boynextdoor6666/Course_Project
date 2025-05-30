import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

// Load environment variables
dotenv.config();

// Попытка подключения к MongoDB, используем try/catch для отлова ошибок
try {
  connectDB();
  console.log('MongoDB connection attempted');
} catch (error) {
  console.error('Failed to connect to MongoDB:', error.message);
  console.log('Application will run with limited functionality without MongoDB');
}

const app = express();
const PORT = process.env.PORT || 5000;
const BACKUP_PORTS = [5001, 5002, 5003, 8000, 8080];

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Функция для запуска сервера с попыткой использовать разные порты
const startServer = (port, backupPorts = []) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use.`);
      
      if (backupPorts.length > 0) {
        const nextPort = backupPorts[0];
        console.log(`Trying port ${nextPort}...`);
        startServer(nextPort, backupPorts.slice(1));
      } else {
        console.error('All ports are in use. Could not start server.');
      }
    } else {
      console.error('Server error:', e);
    }
  });
};

// Start server with backup ports
startServer(PORT, BACKUP_PORTS); 