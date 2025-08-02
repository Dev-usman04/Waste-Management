import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Schedule from './Schedule.jsx';
import PickupStatus from './PickupStatus.jsx';
import Card from '../common/Card.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [pickups, setPickups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/worker/pickups', {
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
        <h1 className="text-3xl font-bold text-slate-800">Worker Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Weekly Schedule</h2>
        <Schedule pickups={pickups} />
      </Card>

      <Card className="mt-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Assigned Pickups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pickups.map((pickup) => (
            <PickupStatus key={pickup._id} pickup={pickup} setPickups={setPickups} />
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;
