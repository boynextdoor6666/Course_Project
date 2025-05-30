import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { generateImage } from '../utils/api';

const GeneratePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const promptInputRef = useRef(null);
  
  const [prompt, setPrompt] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [mode, setMode] = useState('text'); // text, image, edit
  
  // Check if user is logged in
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Пожалуйста, введите текстовый запрос');
      return;
    }
    
    setLoading(true);
    setError('');
    setWarning('');
    setEnhancedPrompt('');
    
    try {
      const newImage = await generateImage(prompt);
      setGeneratedImage(newImage);
      
      // Сохраняем улучшенный промт если он есть
      if (newImage.enhancedPrompt) {
        setEnhancedPrompt(newImage.enhancedPrompt);
      }
      
      // Отображаем предупреждение, если использовался fallback
      if (newImage.isFallback) {
        setWarning('Отображается заглушка вместо сгенерированного изображения. API ключ не настроен или произошла ошибка соединения с сервером Stability AI.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка генерации изображения. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setGeneratedImage(null);
    setPrompt('');
    setError('');
    setWarning('');
    promptInputRef.current?.focus();
  };

  const getRandomPrompt = () => {
    const randomPrompts = [
      'Котенок играет на пианино в космосе',
      'Роботы пьют чай на Луне',
      'Летающий город над океаном на закате',
      'Фантастический лес с светящимися грибами',
      'Русалка в футуристическом городе',
      'Динозавр работает в офисе',
      'Замок из мороженого под радугой',
    ];
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto pt-4 pb-12 px-4"
    >
      <div className="mb-10 text-center">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold mb-4 gradient-text"
        >
          Создание изображения
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-sora-gray-600 dark:text-sora-gray-300 max-w-2xl mx-auto"
        >
          Опишите то, что хотите увидеть, а наша нейросеть создаст уникальное изображение в своем особенном стиле
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        {/* Left sidebar - Controls */}
        <motion.div
          className="md:col-span-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-medium text-xl">Параметры</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    mode === 'text'
                      ? 'bg-sora-blue-100 dark:bg-sora-blue-900/30 text-sora-blue-600 dark:text-sora-blue-400'
                      : 'bg-transparent hover:bg-sora-gray-100 dark:hover:bg-sora-gray-800'
                  }`}
                  onClick={() => setMode('text')}
                >
                  Текст
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    mode === 'image'
                      ? 'bg-sora-blue-100 dark:bg-sora-blue-900/30 text-sora-blue-600 dark:text-sora-blue-400'
                      : 'bg-transparent hover:bg-sora-gray-100 dark:hover:bg-sora-gray-800'
                  }`}
                  onClick={() => setMode('image')}
                >
                  Изображение
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    mode === 'edit'
                      ? 'bg-sora-blue-100 dark:bg-sora-blue-900/30 text-sora-blue-600 dark:text-sora-blue-400'
                      : 'bg-transparent hover:bg-sora-gray-100 dark:hover:bg-sora-gray-800'
                  }`}
                  onClick={() => setMode('edit')}
                >
                  Редактор
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  className="mb-5 bg-danger/10 dark:bg-danger/20 border border-danger/20 text-danger rounded-xl p-3 flex items-start gap-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}

              {warning && (
                <motion.div
                  className="mb-5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 text-yellow-700 dark:text-yellow-500 rounded-xl p-3 flex items-start gap-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{warning}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <label htmlFor="prompt" className="block text-sm font-medium">
                    Текстовый запрос
                  </label>
                  <button
                    type="button"
                    onClick={getRandomPrompt}
                    className="text-xs text-sora-blue-500 hover:text-sora-blue-600 dark:text-sora-blue-400 dark:hover:text-sora-blue-300"
                  >
                    Случайный запрос
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    ref={promptInputRef}
                    id="prompt"
                    rows={4}
                    className="input pr-10"
                    placeholder="Опишите что вы хотите увидеть..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                    required
                  />
                  {prompt && (
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-sora-gray-400 hover:text-sora-gray-600 dark:hover:text-sora-gray-200"
                      onClick={() => setPrompt('')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="flex items-center flex-1">
                    <input
                      id="isPublic"
                      type="checkbox"
                      className="w-4 h-4 text-sora-blue-500 rounded border-sora-gray-300 focus:ring-sora-blue-400"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      disabled={loading}
                    />
                    <label htmlFor="isPublic" className="ml-2 text-sm">
                      Показывать в общей галерее
                    </label>
                  </div>

                  <div className="text-xs text-sora-gray-500 dark:text-sora-gray-400">
                    {prompt ? `${prompt.length} символов` : '0 символов'}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-primary py-3 shimmer"
                  disabled={loading || !prompt.trim()}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Генерируем шедевр...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">✨</span>
                      <span>Сгенерировать</span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Tips section */}
            <div className="border-t border-sora-gray-200 dark:border-sora-gray-700/50 pt-4 mt-2">
              <h3 className="text-sm font-medium mb-2">Советы:</h3>
              <ul className="text-xs text-sora-gray-600 dark:text-sora-gray-400 space-y-1 list-disc pl-4">
                <li>Добавьте больше деталей для лучшего результата</li>
                <li>Укажите стиль, цвета и настроение изображения</li>
                <li>Используйте конкретные прилагательные и существительные</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Right side - Result preview */}
        <motion.div
          className="md:col-span-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="glass-card h-full p-6 flex flex-col">
            <h2 className="font-medium text-xl mb-4">Результат</h2>

            {!generatedImage ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                {loading ? (
                  <div className="w-full max-w-sm">
                    <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden bg-sora-gray-100 dark:bg-sora-gray-800/50">
                      <div className="absolute inset-0 bg-gradient-to-r from-sora-gray-200 to-sora-gray-300 dark:from-sora-gray-800 dark:to-sora-gray-700 animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-sora-blue-300 border-t-sora-blue-600 rounded-full animate-spin"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-sora-gray-200 dark:bg-sora-gray-800 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-sora-gray-200 dark:bg-sora-gray-800 rounded animate-pulse w-3/4"></div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 mb-4 rounded-full bg-sora-gray-100 dark:bg-sora-gray-800/50 flex items-center justify-center text-4xl">
                      🖼️
                    </div>
                    <h3 className="text-lg font-medium mb-2">Ваше изображение появится здесь</h3>
                    <p className="text-sora-gray-500 dark:text-sora-gray-400 text-sm">
                      Введите текстовый запрос и нажмите "Сгенерировать"
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="relative mb-4 rounded-xl overflow-hidden group">
                  <img
                    src={generatedImage.imageUrl}
                    alt={generatedImage.prompt}
                    className="w-full h-auto object-contain shadow-lg rounded-xl"
                  />
                  {generatedImage.isFallback && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1 m-2 rounded-lg opacity-70">
                      Заглушка
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <div className="text-white text-sm mb-1 line-clamp-2">{generatedImage.prompt}</div>
                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        {generatedImage.tags && generatedImage.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {generatedImage.tags && generatedImage.tags.length > 3 && (
                          <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            +{generatedImage.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {enhancedPrompt && (
                  <div className="mb-4 p-3 bg-sora-blue-50 dark:bg-sora-blue-900/20 border border-sora-blue-200 dark:border-sora-blue-800/30 rounded-xl text-xs">
                    <div className="font-medium mb-1 text-sora-blue-700 dark:text-sora-blue-300">Улучшенный запрос:</div>
                    <div className="text-sora-gray-600 dark:text-sora-gray-300">{enhancedPrompt}</div>
                  </div>
                )}

                <div className="flex justify-between items-center gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 py-2 px-4 border border-sora-gray-200 dark:border-sora-gray-700/50 rounded-xl hover:bg-sora-gray-100 dark:hover:bg-sora-gray-800/50 transition-colors text-sm font-medium"
                  >
                    Новое изображение
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/image/${generatedImage._id}`)}
                    className="flex-1 btn btn-primary py-2 flex items-center justify-center gap-2"
                  >
                    <span>Подробнее</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GeneratePage; 