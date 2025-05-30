import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { loginUser } from '../utils/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userData = await loginUser(email, password);
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа. Пожалуйста, проверьте учетные данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в аккаунт</h1>
        
        {error && (
          <motion.div 
            className="bg-red-100 dark:bg-red-900/20 text-danger p-3 rounded-lg mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full btn btn-primary mb-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin w-5 h-5 border-t-2 border-white rounded-full mr-2"></div>
                Вход...
              </div>
            ) : (
              'Войти'
            )}
          </button>
        </form>
        
        <div className="text-center text-sm">
          Еще нет аккаунта?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Зарегистрироваться
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; 