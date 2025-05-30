import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { likeImage } from '../utils/api';

const ImageCard = ({ image, onLike, onDelete }) => {
  const { user } = useContext(AuthContext);
  const [isLiking, setIsLiking] = useState(false);
  const [likesCount, setLikesCount] = useState(image.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(
    user && image.likes?.some(like => like === user._id)
  );

  const handleLike = async () => {
    if (!user) return;
    
    setIsLiking(true);
    try {
      const response = await likeImage(image._id);
      setLikesCount(response.likes.length);
      setIsLiked(!isLiked);
      if (onLike) onLike(image._id, response.likes);
    } catch (error) {
      console.error('Failed to like/unlike image:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div 
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/image/${image._id}`}>
        <div className="relative overflow-hidden rounded-lg h-48 md:h-64">
          <motion.img 
            src={image.imageUrl} 
            alt={image.prompt}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-sm line-clamp-2">{image.prompt}</p>
          </div>
        </div>
      </Link>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {image.createdBy?.username || 'Анонимный пользователь'}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button 
            className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={handleLike}
            disabled={!user || isLiking}
            whileTap={{ scale: 0.95 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill={isLiked ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <span>{likesCount}</span>
          </motion.button>
          
          {user && (user._id === image.createdBy?._id || user.role === 'admin') && (
            <motion.button 
              className="text-gray-500 dark:text-gray-400 hover:text-danger"
              onClick={() => onDelete && onDelete(image._id)}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
      
      {image.tags && image.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {image.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ImageCard; 