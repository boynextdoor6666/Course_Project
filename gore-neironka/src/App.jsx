import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import GeneratePage from './pages/GeneratePage';
import GalleryPage from './pages/GalleryPage';
import ImageDetailsPage from './pages/ImageDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthContext from './context/AuthContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    
    // Check preferred color scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light dark:bg-dark">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-sora-blue-300 border-t-sora-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-light dark:bg-dark"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className={`flex flex-col min-h-screen bg-light dark:bg-dark text-sora-gray-800 dark:text-sora-gray-100 transition-colors duration-300 ${theme}`}>
          {/* Background blobs */}
          <div className="fixed inset-0 overflow-hidden z-[-1]">
            <div className="blob-shape w-[40vw] h-[40vw] -top-[20vw] -left-[20vw] opacity-50"></div>
            <div className="blob-shape w-[35vw] h-[35vw] top-[40vh] -right-[15vw] opacity-30"></div>
            <div className="blob-shape w-[50vw] h-[50vw] -bottom-[30vw] -left-[25vw] opacity-40"></div>
          </div>
          
          <Header theme={theme} toggleTheme={toggleTheme} />
          
          <main className="flex-grow container-custom py-8">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/generate" element={<GeneratePage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/image/:id" element={<ImageDetailsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AnimatePresence>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
