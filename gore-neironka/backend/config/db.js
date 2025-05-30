import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Проверяем наличие строки подключения
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('MongoDB URI not found in environment variables');
      console.warn('Using fallback in-memory database functionality');
      // Не выбрасываем ошибку, чтобы приложение продолжало работать с мок-данными
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Не выбрасываем ошибку дальше, чтобы приложение не упало
    // Приложение будет использовать мок-данные вместо реальной БД
  }
};

export default connectDB; 