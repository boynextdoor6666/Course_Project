import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        className="text-9xl mb-8"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          🤖
        </motion.div>
      </motion.div>
      
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        404 - Страница не найдена
      </motion.h1>
      
      <motion.p
        className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Упс! Похоже, наша нейронка не смогла сгенерировать запрашиваемую страницу.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link to="/" className="btn btn-primary px-8 py-3">
          Вернуться на главную
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage; 