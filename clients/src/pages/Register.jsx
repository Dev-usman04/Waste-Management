import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import api from '../config/api.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/common/Spinner.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    token: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = formData.role === 'user' ? '/register/user' : '/register/worker';
      const data = formData.role === 'user'
        ? { name: formData.name, email: formData.email, password: formData.password, address: formData.address }
        : { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password, token: formData.token };

      const res = await api.post(`/api/auth${endpoint}`, data);
      localStorage.setItem('token', res.data.token);
      toast.success('Registration successful!');
      setTimeout(() => navigate(`/${formData.role}/dashboard`), 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Error registering');
      toast.error(error.response?.data?.message || 'Error registering');
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
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-700">Role</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="worker">Worker</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-slate-700">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
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
          {formData.role === 'user' && (
            <div className="mb-4">
              <label className="block text-slate-700">Address</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          )}
          {formData.role === 'worker' && (
            <>
              <div className="mb-4">
                <label className="block text-slate-700">Phone</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-slate-700">Admin Token</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                />
              </div>
            </>
          )}
          {loading ? <Spinner /> : <Button type="submit">Register</Button>}
        </form>
      </Card>
      <ToastContainer />
    </motion.div>
  );
};

export default Register;