import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Warning: Application will run with limited functionality without MongoDB');
    // Не завершаем процесс, чтобы приложение запустилось даже без базы данных
  }
};

export default connectDB; 