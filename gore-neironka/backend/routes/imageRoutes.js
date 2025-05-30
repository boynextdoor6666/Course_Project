import express from 'express';
import { 
  generateImage, 
  getImages, 
  getUserImages, 
  getImageById, 
  likeImage, 
  deleteImage 
} from '../controllers/imageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getImages);
router.route('/generate').post(protect, generateImage);
router.route('/myimages').get(protect, getUserImages);
router.route('/:id').get(getImageById);
router.route('/:id/like').put(protect, likeImage);
router.route('/:id').delete(protect, deleteImage);

export default router; 