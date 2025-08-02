import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UserDashboard from './components/user/Dashboard.jsx';
import WorkerDashboard from './components/worker/Dashboard.jsx';
import AdminDashboard from './components/admin/Dashboard.jsx';
import PrivateRoute from './components/common/PrivateRoute.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Toast container for all pages */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
          draggable
          closeOnClick
        />

        {/* App Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-protected dashboard routes */}
          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute roles={['user']}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/worker/dashboard"
            element={
              <PrivateRoute roles={['worker']}>
                <WorkerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
