import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';
import api from '../../config/api.js';

const TokenGenerator = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const generateToken = async () => {
    try {
      const res = await api.post('/api/admin/token', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setToken(res.data.token);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error generating token');
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Generate Worker Token</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {token && <p className="text-emerald-600 mb-4">Token: {token}</p>}
      <Button onClick={generateToken}>Generate Token</Button>
    </Card>
  );
};

export default TokenGenerator;