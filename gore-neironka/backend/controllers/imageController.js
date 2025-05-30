import OpenAI from 'openai';
import Image from '../models/Image.js';
import dotenv from 'dotenv';

dotenv.config();

// Mock images для разработки без MongoDB
const mockImages = [
  {
    _id: '1',
    prompt: 'Космический котенок на луне',
    imageUrl: 'https://picsum.photos/seed/cat1/1024/1024',
    createdBy: { _id: '1', username: 'test' },
    tags: ['космос', 'котенок', 'луна'],
    likes: [],
    public: true,
    createdAt: new Date('2023-01-01')
  },
  {
    _id: '2',
    prompt: 'Закат над горами в стиле аниме',
    imageUrl: 'https://picsum.photos/seed/sunset/1024/1024',
    createdBy: { _id: '1', username: 'test' },
    tags: ['закат', 'горы', 'аниме'],
    likes: [],
    public: true,
    createdAt: new Date('2023-01-02')
  }
];

// Mock OpenAI for development
// В реальном приложении здесь будет использоваться настоящий клиент OpenAI
const openai = {
  images: {
    generate: async ({ prompt }) => {
      console.log('Mock generating image for prompt:', prompt);
      return {
        data: [
          {
            url: `https://picsum.photos/seed/${Date.now()}/1024/1024`
          }
        ]
      };
    }
  }
};

// Проверка соединения с MongoDB
const isMongoConnected = () => {
  try {
    return Image.db.db.topology.isConnected();
  } catch (err) {
    console.log('MongoDB is not connected, using mock data');
    return false;
  }
};

// @desc    Generate image using AI
// @route   POST /api/images/generate
// @access  Private
const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Please provide a prompt' });
    }

    // Используем мок вместо реального API
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });
    
    // Получаем URL из ответа
    const imageUrl = response.data[0].url;
    
    // Проверяем подключение MongoDB
    if (isMongoConnected()) {
      // Save the image to the database
      const newImage = await Image.create({
        prompt,
        imageUrl,
        createdBy: req.user._id,
        tags: prompt.split(' ').filter(tag => tag.length > 3),
      });
      
      return res.status(201).json(newImage);
    } else {
      // Используем мок-данные
      const newImage = {
        _id: Date.now().toString(),
        prompt,
        imageUrl,
        createdBy: req.user || { _id: '1', username: 'test' },
        tags: prompt.split(' ').filter(tag => tag.length > 3),
        likes: [],
        public: true,
        createdAt: new Date()
      };
      
      mockImages.push(newImage);
      return res.status(201).json(newImage);
    }
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ message: 'Failed to generate image', error: error.message });
  }
};

// @desc    Get all public images
// @route   GET /api/images
// @access  Public
const getImages = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const images = await Image.find({ public: true })
        .sort({ createdAt: -1 })
        .populate('createdBy', 'username')
        .limit(20);
      
      return res.json(images);
    } else {
      // Используем мок-данные
      return res.json(mockImages);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's images
// @route   GET /api/images/myimages
// @access  Private
const getUserImages = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const images = await Image.find({ createdBy: req.user._id })
        .sort({ createdAt: -1 })
        .populate('createdBy', 'username');
      
      return res.json(images);
    } else {
      // Используем мок-данные для текущего пользователя
      const userImages = mockImages.filter(img => 
        img.createdBy._id === (req.user ? req.user._id : '1')
      );
      return res.json(userImages);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get image by id
// @route   GET /api/images/:id
// @access  Public/Private (depends on image's public status)
const getImageById = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const image = await Image.findById(req.params.id)
        .populate('createdBy', 'username')
        .populate('likes', 'username');
      
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      // Check if image is private and if the requester is the owner
      if (!image.public && (!req.user || image.createdBy._id.toString() !== req.user._id.toString())) {
        return res.status(403).json({ message: 'Not authorized to view this image' });
      }

      return res.json(image);
    } else {
      // Используем мок-данные
      const image = mockImages.find(img => img._id === req.params.id);
      
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      return res.json(image);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Toggle like on an image
// @route   PUT /api/images/:id/like
// @access  Private
const likeImage = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const image = await Image.findById(req.params.id);
      
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      const alreadyLiked = image.likes.includes(req.user._id);
      
      if (alreadyLiked) {
        // Unlike
        image.likes = image.likes.filter(
          (id) => id.toString() !== req.user._id.toString()
        );
      } else {
        // Like
        image.likes.push(req.user._id);
      }

      await image.save();
      
      return res.json({ likes: image.likes });
    } else {
      // Используем мок-данные
      const imageIndex = mockImages.findIndex(img => img._id === req.params.id);
      
      if (imageIndex === -1) {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      const userId = req.user ? req.user._id : '1';
      const alreadyLiked = mockImages[imageIndex].likes.includes(userId);
      
      if (alreadyLiked) {
        mockImages[imageIndex].likes = mockImages[imageIndex].likes.filter(id => id !== userId);
      } else {
        mockImages[imageIndex].likes.push(userId);
      }
      
      return res.json({ likes: mockImages[imageIndex].likes });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Private
const deleteImage = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const image = await Image.findById(req.params.id);
      
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      // Check if user is authorized to delete
      if (image.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this image' });
      }

      await image.remove();
      
      return res.json({ message: 'Image removed' });
    } else {
      // Используем мок-данные
      const imageIndex = mockImages.findIndex(img => img._id === req.params.id);
      
      if (imageIndex === -1) {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      const userId = req.user ? req.user._id : '1';
      if (mockImages[imageIndex].createdBy._id !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this image' });
      }
      
      mockImages.splice(imageIndex, 1);
      return res.json({ message: 'Image removed' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { 
  generateImage, 
  getImages, 
  getUserImages, 
  getImageById, 
  likeImage, 
  deleteImage 
}; 