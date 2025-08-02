import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Button from '../common/Button.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

const FeedbackForm = ({ pickupId }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ rating: 0, comment: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/user/feedback', { ...formData, pickupId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFormData({ rating: 0, comment: '' });
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting feedback');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4"
    >
      <h3 className="text-lg font-semibold text-slate-800">Rate This Pickup</h3>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-slate-700">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            className="w-full p-2 border rounded-lg"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
          />
        </div>
        <div className="mb-2">
          <label className="block text-slate-700">Comment</label>
          <textarea
            className="w-full p-2 border rounded-lg"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          ></textarea>
        </div>
        <Button type="submit">Submit Feedback</Button>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;