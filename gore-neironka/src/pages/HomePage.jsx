import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="py-12">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl mb-6 inline-block"
        >
          🤖
        </motion.div>
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Горе-нейронка
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Создавайте странные, нелепые и уникальные изображения с помощью нашей нейросети, которая намеренно делает это не очень хорошо!
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {user ? (
            <Link to="/generate" className="btn btn-primary text-lg px-8 py-3">
              Начать генерацию
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                Регистрация
              </Link>
              <Link to="/login" className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-lg px-8 py-3">
                Войти
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="card text-center" variants={itemVariants}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-primary text-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                🎨
              </motion.div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Креативность</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Создавайте необычные изображения, которые удивят ваших друзей и подписчиков.
          </p>
        </motion.div>

        <motion.div className="card text-center" variants={itemVariants}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-secondary text-2xl">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡
              </motion.div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Скорость</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Получайте результаты в считанные секунды, без длительного ожидания.
          </p>
        </motion.div>

        <motion.div className="card text-center" variants={itemVariants}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-danger text-2xl">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ❤️
              </motion.div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Коллекция</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Сохраняйте, делитесь и лайкайте изображения других пользователей.
          </p>
        </motion.div>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl p-8 md:p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Готовы создать свое первое изображение?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Просто введите текстовый запрос, и наша нейронка создаст изображение... на свой вкус!
        </p>
        
        {user ? (
          <Link to="/generate" className="btn btn-primary text-lg px-8 py-3">
            Начать генерацию
          </Link>
        ) : (
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Зарегистрируйтесь бесплатно
          </Link>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;