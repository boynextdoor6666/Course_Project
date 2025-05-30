import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { getImageById, likeImage, deleteImage } from '../utils/api';

const ImageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageData = await getImageById(id);
        setImage(imageData);
        setLikesCount(imageData.likes?.length || 0);
        
        if (user) {
          setIsLiked(imageData.likes?.some(like => like === user._id));
        }
      } catch (err) {
        setError('Ошибка загрузки изображения. Пожалуйста, попробуйте позже.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImage();
  }, [id, user]);
  
  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await likeImage(id);
      setLikesCount(response.likes.length);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Ошибка при добавлении/удалении лайка:', err);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить это изображение?')) {
      try {
        await deleteImage(id);
        navigate('/gallery');
      } catch (err) {
        console.error('Ошибка удаления изображения:', err);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin-slow w-16 h-16 border-t-4 border-b-4 border-primary rounded-full"></div>
      </div>
    );
  }
  
  if (error || !image) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">Ошибка</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error || 'Изображение не найдено'}
        </p>
        <Link to="/gallery" className="btn btn-primary">
          Вернуться в галерею
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <Link to="/gallery" className="text-primary hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к галерее
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <motion.div 
              className="card p-0 overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={image.imageUrl} 
                alt={image.prompt}
                className="w-full h-auto"
              />
            </motion.div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="card">
              <h1 className="text-2xl font-bold mb-6 truncate">
                Изображение #{id.substring(0, 6)}
              </h1>
              
              <div className="mb-6">
                <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Запрос:
                </h2>
                <p className="text-lg">{image.prompt}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Автор:
                </h2>
                <p>{image.createdBy?.username || 'Анонимный пользователь'}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Дата создания:
                </h2>
                <p>{new Date(image.createdAt).toLocaleDateString()}</p>
              </div>
              
              {image.tags && image.tags.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Теги:
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {image.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4">
                <button 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-500' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                  }`}
                  onClick={handleLike}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill={isLiked ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  <span>{likesCount} {likesCount === 1 ? 'лайк' : 'лайков'}</span>
                </button>
                
                {user && (user._id === image.createdBy?._id || user.role === 'admin') && (
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-lg transition-colors hover:bg-red-200 dark:hover:bg-red-900/40"
                    onClick={handleDelete}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Удалить</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageDetailsPage; 