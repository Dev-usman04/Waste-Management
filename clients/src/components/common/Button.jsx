import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className }) => {
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-lg font-semibold ${variants[variant]} transition duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default Button;