import axios from 'axios';
import Image from '../models/Image.js';
import dotenv from 'dotenv';

dotenv.config();

// Явно устанавливаем API ключ, так как .env не загружается корректно
// Очищаем ключ от возможных пробелов и переносов строк
const STABILITY_API_KEY = 'sk-lFhYkKJzqHxLFwSG8qthz4jyNEPYxlJXazRm7Bxj8EakruRc'.trim();

console.log('=============== API KEY VALIDATION ===============');
console.log('API KEY LENGTH:', STABILITY_API_KEY.length);
console.log('API KEY FIRST 5 CHARS:', STABILITY_API_KEY.substring(0, 5));
console.log('API KEY CONTAINS QUOTES:', STABILITY_API_KEY.includes('"') || STABILITY_API_KEY.includes("'"));
console.log('API KEY CONTAINS SPACES:', STABILITY_API_KEY.includes(" "));
console.log('=================================================');

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

// Улучшенная функция для обработки промптов
function enhancePrompt(prompt) {
  // Проверяем, на каком языке промпт
  const isRussian = /[а-яА-Я]/.test(prompt);
  
  if (isRussian) {
    // Если текст на русском, добавляем инструкцию переводить на английский
    // и улучшать описание для лучших результатов
    return `Create a detailed image based on this description in Russian: "${prompt}". 
            Translate to English and interpret correctly. High quality, detailed image.`;
  } else {
    // Если текст уже на английском, просто улучшаем его
    return `${prompt}. High quality, detailed image.`;
  }
}

// Mock Stability AI для разработки
const stabilityAI = {
  generateImage: async (prompt) => {
    console.log('Generating image with Stability AI for prompt:', prompt);
    
    try {
      console.log('Making API request to Stability AI...');
      
      // Улучшаем промпт для лучшего результата
      const enhancedPrompt = enhancePrompt(prompt);
      console.log('Enhanced prompt:', enhancedPrompt);
      
      // Настройка параметров для улучшения качества и соответствия
      const requestData = {
        text_prompts: [
          { text: enhancedPrompt, weight: 1.0 },
          // Добавляем негативный промпт для улучшения качества
          { text: "blurry, bad quality, distorted, low resolution, ugly", weight: -0.9 }
        ],
        cfg_scale: 8, // Увеличиваем следование промпту
        height: 1024,
        width: 1024, 
        samples: 1,
        steps: 40, // Увеличиваем количество шагов для лучших деталей
        style_preset: "photographic", // Используем фотореалистичный стиль
      };
      
      console.log('Request data:', JSON.stringify(requestData, null, 2));
      
      // Печатаем заголовки без полного API ключа для безопасности
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'application/json'
      };
      
      console.log('Headers:', {
        'Content-Type': headers['Content-Type'],
        'Authorization': `Bearer ${STABILITY_API_KEY.substring(0, 5)}...`,
        'Accept': headers['Accept']
      });
      
      // Реальный вызов API Stability AI
      const response = await axios({
        method: 'post',
        url: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        headers,
        data: requestData,
        timeout: 60000, // Увеличиваем таймаут до 60 секунд
      });
      
      console.log('Stability API response received with status:', response.status);
      console.log('Has artifacts:', response.data && response.data.artifacts ? 'YES' : 'NO');
      console.log('Artifacts count:', response.data?.artifacts?.length || 0);
      
      // Обработка ответа от API
      if (response.data && response.data.artifacts && response.data.artifacts.length > 0) {
        // Получаем base64 изображения из ответа
        const base64Image = response.data.artifacts[0].base64;
        
        // Проверяем, что base64 строка не пустая
        if (!base64Image || base64Image.length < 100) {
          console.error('Base64 image data is too short or empty:', base64Image?.substring(0, 30) || 'empty');
          throw new Error('Invalid base64 image data received');
        }
        
        // Создаем URL для изображения, который можно сохранить в БД
        const imageUrl = `data:image/png;base64,${base64Image}`;
        console.log('Successfully generated image from Stability AI');
        return { 
          imageUrl, 
          isFallback: false,
          originalPrompt: prompt,
          enhancedPrompt: enhancedPrompt
        };
      } else {
        console.error('Invalid response structure from Stability API');
        throw new Error('Invalid response from Stability API');
      }
    } catch (error) {
      console.error('Error calling Stability AI:', error.message);
      
      if (error.response) {
        console.error('API response status:', error.response.status);
        console.error('API response data:', JSON.stringify(error.response.data || {}));
      } else if (error.request) {
        console.error('No response received from API. Request details:', error.request._currentUrl || 'unknown URL');
        console.error('Is network reachable:', error.code !== 'ENOTFOUND' ? 'YES' : 'NO');
      } else {
        console.error('Error before making request:', error.message);
      }
      
      // Создаем более релевантный URL на основе промпта для fallback изображения
      const seed = prompt.split(' ').join('-').toLowerCase();
      return {
        imageUrl: `https://picsum.photos/seed/${seed}/1024/1024`,
        isFallback: true,
        error: error.message
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

// @desc    Generate image using Stability AI
// @route   POST /api/images/generate
// @access  Private
const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Please provide a prompt' });
    }

    // Используем Stability AI для генерации изображения
    const result = await stabilityAI.generateImage(prompt);
    
    // Получаем URL из ответа
    const imageUrl = result.imageUrl;
    
    // Добавляем информацию, использовался ли fallback
    const isFallback = result.isFallback || false;
    
    // Проверяем подключение MongoDB
    if (isMongoConnected()) {
      // Save the image to the database
      const newImage = await Image.create({
        prompt,
        imageUrl,
        createdBy: req.user._id,
        tags: prompt.split(' ').filter(tag => tag.length > 3),
        isFallback, // Сохраняем информацию о использовании fallback
      });
      
      return res.status(201).json({
        ...newImage.toObject(),
        isFallback,
        message: isFallback ? 'Использовано fallback изображение из-за проблем с API' : undefined
      });
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
        createdAt: new Date(),
        isFallback,
      };
      
      mockImages.push(newImage);
      return res.status(201).json({
        ...newImage,
        isFallback,
        message: isFallback ? 'Использовано fallback изображение из-за проблем с API' : undefined
      });
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