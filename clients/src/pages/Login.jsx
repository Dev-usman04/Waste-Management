import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import Card from '../components/common/Card.jsx';
import {jwtDecode} from 'jwt-decode';
import api from '../config/api.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/common/Spinner.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', formData);
      login(res.data.token);
      toast.success('Login successful!');
      setTimeout(() => navigate(`/${jwtDecode(res.data.token).role}/dashboard`), 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Error logging in');
      toast.error(error.response?.data?.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 max-w-md"
    >
      <Card>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-lg"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          {loading ? <Spinner /> : <Button type="submit">Login</Button>}
        </form>
      </Card>
      <ToastContainer />
    </motion.div>
  );
};

export default Login;