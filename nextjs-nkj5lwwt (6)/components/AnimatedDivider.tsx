'use client'; // <-- PERBAIKAN

import { motion } from 'framer-motion';

const AnimatedDivider = () => {
  return (
    <motion.div
      className="h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
      initial={{ width: '0%', opacity: 0 }}
      whileInView={{ width: '100%', opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      viewport={{ once: true }}
    />
  );
};

export default AnimatedDivider;