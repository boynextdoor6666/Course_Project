import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ theme, toggleTheme }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-dark/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container-custom flex justify-between items-center py-4">
        <Link to="/">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-3xl mr-3 relative"
              whileHover={{ rotate: [0, -10, 15, -10, 0], transition: { duration: 0.5 } }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-sora-blue-400 to-sora-blue-600 rounded-xl flex items-center justify-center text-white">
                🤖
              </div>
              <motion.div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-sora-blue-400 to-secondary rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Горе-нейронка
              </h1>
              <p className="text-xxs text-sora-gray-500 dark:text-sora-gray-400">
                Генератор странных изображений
              </p>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 items-center">
            <Link to="/" className="opacity-90 hover:opacity-100 hover:text-sora-blue-500 transition-all">
              Главная
            </Link>
            <Link to="/gallery" className="opacity-90 hover:opacity-100 hover:text-sora-blue-500 transition-all">
              Галерея
            </Link>
            {user && (
              <Link to="/generate" className="btn btn-primary">
                <span className="mr-2">✨</span>
                <span>Создать</span>
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-sora-gray-100 dark:bg-sora-gray-800 transition-colors" 
              onClick={toggleTheme}
              aria-label="Переключить тему"
            >
              <motion.div 
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.5 }}
              >
                {theme === 'dark' ? (
                  <span className="text-lg">🌙</span>
                ) : (
                  <span className="text-lg">☀️</span>
                )}
              </motion.div>
            </button>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-full pr-2 pl-1 py-1 bg-sora-gray-100 dark:bg-sora-gray-800 hover:bg-sora-gray-200 dark:hover:bg-sora-gray-700 transition-colors group">
                  <div className="w-7 h-7 rounded-full bg-sora-blue-100 flex items-center justify-center text-sm text-sora-blue-600">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-sm">{user.username}</span>
                  <motion.div 
                    className="w-4 h-4 opacity-60"
                    initial={false}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 glass-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/profile" className="menu-item flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Профиль</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="menu-item w-full text-left flex items-center gap-2 text-danger"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Выйти</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm hover:text-sora-blue-500 transition-colors">
                  Войти
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-sora-gray-100 dark:bg-sora-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Открыть меню"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden glass-card mx-4 mb-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 flex flex-col space-y-4">
              <div className="flex justify-between items-center pb-2 mb-2 border-b border-sora-gray-200 dark:border-sora-gray-700">
                <div className="text-sm font-medium">Навигация</div>
                <button 
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-sora-gray-100 dark:bg-sora-gray-700 transition-colors"
                >
                  {theme === 'dark' ? (
                    <span className="text-sm">🌙</span>
                  ) : (
                    <span className="text-sm">☀️</span>
                  )}
                </button>
              </div>
              <Link 
                to="/" 
                className="menu-item"
              >
                Главная
              </Link>
              <Link 
                to="/gallery" 
                className="menu-item"
              >
                Галерея
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/generate" 
                    className="menu-item flex items-center gap-2 text-sora-blue-500"
                  >
                    <span>✨</span>
                    <span>Создать изображение</span>
                  </Link>
                  <div className="border-t border-sora-gray-200 dark:border-sora-gray-700 my-2 pt-2">
                    <div className="px-4 py-2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-sora-blue-100 flex items-center justify-center text-xs text-sora-blue-600">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <Link 
                      to="/profile" 
                      className="menu-item flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Профиль</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="menu-item w-full text-left flex items-center gap-2 text-danger"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Выйти</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-sora-gray-200 dark:border-sora-gray-700">
                    <Link 
                      to="/login"
                      className="btn btn-secondary"
                    >
                      Войти
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn btn-primary"
                    >
                      Регистрация
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 