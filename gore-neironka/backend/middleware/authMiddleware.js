import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Проверка соединения с MongoDB
const isMongoConnected = () => {
  try {
    return User.db.db.topology.isConnected();
  } catch (err) {
    console.log('MongoDB is not connected, using mock data');
    return false;
  }
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_dev');

      if (isMongoConnected()) {
        // Get user from the token in MongoDB
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Использовать мок-данные для пользователя
        req.user = {
          _id: decoded.id || '1',
          username: 'test_user',
          email: 'test@example.com',
          role: 'user'
        };
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin }; 