import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Mock users для разработки без MongoDB
const mockUsers = [
  {
    _id: '1',
    username: 'test',
    email: 'test@example.com',
    password: '$2a$10$3o4vYwrfMd1XG9cLRvY.G.ou2Q.8BQ6mMHfx.aqIZMzrWk9Q9jP4i', // хеш для пароля "password"
    role: 'user'
  }
];

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_for_dev', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверяем наличие подключения к MongoDB
    let isMongoConnected = false;
    try {
      // Проверка соединения с MongoDB
      isMongoConnected = User.db.db.topology.isConnected();
    } catch (err) {
      console.log('MongoDB is not connected, using mock data');
    }

    if (isMongoConnected) {
      // Check if user exists in MongoDB
      const userExists = await User.findOne({ $or: [{ email }, { username }] });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user in MongoDB
      const user = await User.create({
        username,
        email,
        password,
      });

      if (user) {
        return res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      }
    } else {
      // Использование заглушки без MongoDB
      const mockUserExists = mockUsers.find(
        (u) => u.email === email || u.username === username
      );

      if (mockUserExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Создаем нового пользователя в мок-данных
      const newUser = {
        _id: Date.now().toString(),
        username,
        email,
        password: 'mock_hashed_password',
        role: 'user'
      };

      mockUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id),
      });
    }

    return res.status(400).json({ message: 'Invalid user data' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем наличие подключения к MongoDB
    let isMongoConnected = false;
    try {
      isMongoConnected = User.db.db.topology.isConnected();
    } catch (err) {
      console.log('MongoDB is not connected, using mock data');
    }

    if (isMongoConnected) {
      // Check for user email in MongoDB
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      }
    } else {
      // Использование заглушки без MongoDB
      // Для демо всегда успешно входим с любыми данными
      const mockUser = {
        _id: '1',
        username: email.split('@')[0], // Используем часть email как имя
        email,
        role: 'user'
      };

      return res.json({
        _id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        token: generateToken(mockUser._id),
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // Проверяем наличие подключения к MongoDB
    let isMongoConnected = false;
    try {
      isMongoConnected = User.db.db.topology.isConnected();
    } catch (err) {
      console.log('MongoDB is not connected, using mock data');
    }

    if (isMongoConnected) {
      const user = await User.findById(req.user._id);

      if (user) {
        return res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        });
      }
    } else {
      // Использование заглушки без MongoDB
      return res.json({
        _id: req.user._id || '1',
        username: 'test_user',
        email: 'test@example.com',
        role: 'user',
      });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error getting user profile', error: error.message });
  }
};

export { registerUser, loginUser, getUserProfile }; 