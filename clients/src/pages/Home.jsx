import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 text-center"
    >
      <Card>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Waste Management App</h1>
        <p className="text-lg text-slate-600 mb-6">Efficiently manage waste pickups with ease.</p>
        <div className="space-x-4">
          <Link to="/login"><Button>Login</Button></Link>
          <Link to="/register"><Button variant="secondary">Register</Button></Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default Home;