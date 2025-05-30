import OpenAI from 'openai';
import Image from '../models/Image.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate image using AI
// @route   POST /api/images/generate
// @access  Private
const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400);
      throw new Error('Please provide a prompt');
    }

    // This is a placeholder for the actual OpenAI image generation
    // In a real implementation, you'd use the OpenAI API
    
    // Mock image generation - in production, use actual OpenAI API
    // const response = await openai.images.generate({
    //   prompt: prompt,
    //   n: 1,
    //   size: '1024x1024',
    // });
    
    // For demo purposes, we'll use a placeholder image
    const imageUrl = `https://picsum.photos/seed/${Date.now()}/1024/1024`;
    
    // Save the image to the database
    const newImage = await Image.create({
      prompt,
      imageUrl,
      createdBy: req.user._id,
      tags: prompt.split(' ').filter(tag => tag.length > 3),
    });

    res.status(201).json(newImage);
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
    const images = await Image.find({ public: true })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username')
      .limit(20);
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's images
// @route   GET /api/images/myimages
// @access  Private
const getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get image by id
// @route   GET /api/images/:id
// @access  Public/Private (depends on image's public status)
const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('likes', 'username');
    
    if (!image) {
      res.status(404);
      throw new Error('Image not found');
    }

    // Check if image is private and if the requester is the owner
    if (!image.public && (!req.user || image.createdBy._id.toString() !== req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized to view this image');
    }

    res.json(image);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Toggle like on an image
// @route   PUT /api/images/:id/like
// @access  Private
const likeImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      res.status(404);
      throw new Error('Image not found');
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
    
    res.json({ likes: image.likes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Private
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      res.status(404);
      throw new Error('Image not found');
    }

    // Check if user is authorized to delete
    if (image.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this image');
    }

    await image.remove();
    
    res.json({ message: 'Image removed' });
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