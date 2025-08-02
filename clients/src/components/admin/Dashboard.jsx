import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import TokenGenerator from './TokenGenerator.jsx';
import Card from '../common/Card.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../config/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, workers: 0, pickups: 0, pendingPickups: 0, avgRating: 0 });
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [missed, setMissed] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, workersRes, pickupsRes, feedbackRes, missedRes] = await Promise.all([
          api.get('/api/admin/stats', { headers }),
          api.get('/api/admin/users', { headers }),
          api.get('/api/admin/workers', { headers }),
          api.get('/api/admin/pickups', { headers }),
          api.get('/api/admin/feedback', { headers }),
          api.get('/api/admin/missed', { headers }),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setWorkers(workersRes.data);
        setPickups(pickupsRes.data);
        setFeedback(feedbackRes.data);
        setMissed(missedRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAssign = async (pickupId, workerId) => {
    try {
      await api.put('/api/admin/pickup/assign', { pickupId, workerId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Pickup assigned!');
      setPickups(pickups => pickups.map(p => p._id === pickupId ? { ...p, workerId: workers.find(w => w._id === workerId) } : p));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error assigning pickup');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-slate-700">Total Users</h3>
          <p className="text-2xl text-emerald-600">{stats.users}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-700">Total Workers</h3>
          <p className="text-2xl text-emerald-600">{stats.workers}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-700">Average Rating</h3>
          <p className="text-2xl text-emerald-600">{stats.avgRating.toFixed(1)}</p>
        </Card>
      </div>
      <Card>
        <TokenGenerator />
      </Card>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Users</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Address</th>
                <th className="py-2 px-4">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b hover:bg-slate-50 transition">
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.address}</td>
                  <td className="py-2 px-4">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-slate-700 mb-4">Workers</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
              </tr>
            </thead>
            <tbody>
              {workers.map(w => (
                <tr key={w._id} className="border-b hover:bg-slate-50 transition">
                  <td className="py-2 px-4">{w.name}</td>
                  <td className="py-2 px-4">{w.email}</td>
                  <td className="py-2 px-4">{w.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-slate-700 mb-4">Pickups</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Worker</th>
                <th className="py-2 px-4">Address</th>
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Assign</th>
              </tr>
            </thead>
            <tbody>
              {pickups.map(p => (
                <tr key={p._id} className="border-b hover:bg-slate-50 transition">
                  <td className="py-2 px-4">{p.userId?.name || '-'}</td>
                  <td className="py-2 px-4">{p.workerId?.name || '-'}</td>
                  <td className="py-2 px-4">{p.address}</td>
                  <td className="py-2 px-4">{p.pickupType}</td>
                  <td className="py-2 px-4">{new Date(p.dateTime).toLocaleString()}</td>
                  <td className="py-2 px-4">{p.status}</td>
                  <td className="py-2 px-4">
                    {!p.workerId ? (
                      <div className="flex items-center space-x-2">
                        <select className="p-1 border rounded" onChange={e => setPickups(pickups => pickups.map(px => px._id === p._id ? { ...px, assignTo: e.target.value } : px))} value={p.assignTo || ''}>
                          <option value="">Select Worker</option>
                          {workers.map(w => (
                            <option key={w._id} value={w._id}>{w.name}</option>
                          ))}
                        </select>
                        <button
                          className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition"
                          disabled={!p.assignTo}
                          onClick={() => handleAssign(p._id, p.assignTo)}
                        >Assign</button>
                      </div>
                    ) : (
                      <span className="text-emerald-600">Assigned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-slate-700 mb-4">Feedback</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Pickup</th>
                <th className="py-2 px-4">Rating</th>
                <th className="py-2 px-4">Comment</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map(f => (
                <tr key={f._id} className="border-b hover:bg-slate-50 transition">
                  <td className="py-2 px-4">{f.userId?.name || '-'}</td>
                  <td className="py-2 px-4">{f.pickupId?.address || '-'}</td>
                  <td className="py-2 px-4">{f.rating}</td>
                  <td className="py-2 px-4">{f.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-slate-700 mb-4">Missed Pickups</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Pickup</th>
                <th className="py-2 px-4">Reason</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {missed.map(m => (
                <tr key={m._id} className="border-b hover:bg-slate-50 transition">
                  <td className="py-2 px-4">{m.userId?.name || '-'}</td>
                  <td className="py-2 px-4">{m.pickupId?.address || '-'}</td>
                  <td className="py-2 px-4">{m.reason}</td>
                  <td className="py-2 px-4">{m.status}</td>
                  <td className="py-2 px-4">{new Date(m.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};

export default Dashboard;
