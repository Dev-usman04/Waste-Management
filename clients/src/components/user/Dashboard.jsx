import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import PickupForm from './PickupForm.jsx';
import FeedbackForm from './FeedbackForm.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import Card from '../common/Card.jsx';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [pickups, setPickups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/pickup/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPickups(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPickups();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      <PickupForm />
      <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Pickup History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pickups.map((pickup) => (
          <Card key={pickup._id}>
            <p><strong>Address:</strong> {pickup.address}</p>
            <p><strong>Type:</strong> {pickup.pickupType}</p>
            <p><strong>Date:</strong> {new Date(pickup.dateTime).toLocaleString()}</p>
            <p><strong>Status:</strong> {pickup.status}</p>
            {pickup.image && <img src={pickup.image} alt="Pickup" className="w-full h-32 object-cover mt-2 rounded" />}
            {pickup.status === 'Collected' && <FeedbackForm pickupId={pickup._id} />}
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
