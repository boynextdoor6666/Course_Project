import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { getUserProfile, getUserImages, deleteImage } from '../utils/api';
import ImageCard from '../components/ImageCard';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Check if user is logged in
  if (!user) {
    navigate('/login');
    return null;
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, imagesData] = await Promise.all([
          getUserProfile(),
          getUserImages()
        ]);
        
        setProfile(profileData);
        setImages(imagesData);
      } catch (err) {
        setError('Ошибка загрузки данных профиля. Пожалуйста, попробуйте позже.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это изображение?')) {
      try {
        await deleteImage(id);
        setImages(images.filter(img => img._id !== id));
      } catch (err) {
        console.error('Ошибка удаления изображения:', err);
      }
    }
  };
  
  const handleLike = (id, likes) => {
    setImages(
      images.map(img => (img._id === id ? { ...img, likes } : img))
    );
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin-slow w-16 h-16 border-t-4 border-b-4 border-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">{user.username.charAt(0).toUpperCase()}</span>
                </div>
                
                <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
                
                <div className="w-full border-t border-gray-200 dark:border-gray-700 my-4"></div>
                
                <div className="flex flex-col w-full gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/generate')}
                  >
                    Создать изображение
                  </button>
                  
                  <button 
                    className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">Профиль</h2>
              
              {error && (
                <div className="bg-red-100 dark:bg-red-900/20 text-danger p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Имя пользователя:
                  </h3>
                  <p className="text-lg">{profile?.username}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Email:
                  </h3>
                  <p className="text-lg">{profile?.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Роль:
                  </h3>
                  <p className="text-lg capitalize">{profile?.role}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Дата регистрации:
                  </h3>
                  <p className="text-lg">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Неизвестно'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-6">Мои изображения</h2>
              
              {images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {images.map(image => (
                    <ImageCard
                      key={image._id}
                      image={image}
                      onDelete={handleDelete}
                      onLike={handleLike}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <motion.div
                    className="text-6xl mb-4 inline-block"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🖼️
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">У вас еще нет изображений</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Начните создавать удивительные изображения прямо сейчас!
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/generate')}
                  >
                    Создать первое изображение
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage; 