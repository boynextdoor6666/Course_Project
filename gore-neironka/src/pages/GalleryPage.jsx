import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllImages, deleteImage } from '../utils/api';
import ImageCard from '../components/ImageCard';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesData = await getAllImages();
        setImages(imagesData);
      } catch (err) {
        setError('Ошибка загрузки изображений. Пожалуйста, попробуйте позже.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  // Filter and sort images
  const filteredImages = images.filter(image => 
    image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'popular') {
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    }
    return 0;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Галерея изображений
        </h1>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="input pl-10"
              placeholder="Поиск по запросу или тегам..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <select
            className="input max-w-[200px]"
            value={sortBy}
            onChange={handleSort}
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="popular">По популярности</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin-slow w-16 h-16 border-t-4 border-b-4 border-primary rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/20 text-danger p-4 rounded-lg text-center">
            {error}
          </div>
        ) : sortedImages.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedImages.map(image => (
              <ImageCard
                key={image._id}
                image={image}
                onDelete={handleDelete}
                onLike={handleLike}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <motion.div
              className="text-6xl mb-4 inline-block"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔍
            </motion.div>
            <h2 className="text-xl font-bold mb-2">Изображения не найдены</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm
                ? 'Попробуйте изменить поисковый запрос'
                : 'В галерее пока нет изображений'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GalleryPage; 