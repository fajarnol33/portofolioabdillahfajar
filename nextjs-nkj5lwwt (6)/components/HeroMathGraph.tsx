'use client'; // <-- SATU-SATUNYA TAMBAHAN PENTING

import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/motion'; 

const HeroMathGraph = () => {
  return (
    <div className="w-full h-auto mb-4">
      <svg
        viewBox="0 0 800 200"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#f472b6' }} />
            <stop offset="50%" style={{ stopColor: '#c026d3' }} />
            <stop offset="100%" style={{ stopColor: '#22d3ee' }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1 } }}
        >
          <path
            d="M 50 170 L 750 170 M 50 20 L 50 170"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
          <path
            d="M 50 70 L 750 70 M 50 120 L 750 120 M 250 20 L 250 170 M 450 20 L 450 170 M 650 20 L 650 170"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </motion.g>

        <motion.path
          d="M 50 125 Q 65 115, 80 125 T 110 125 T 140 125 T 170 125 T 200 125 T 230 125 T 260 125 T 290 125 T 320 125 T 350 125 T 380 125 T 410 125 T 440 125 T 470 125 T 500 125 T 530 125 T 560 125 T 590 125 T 620 125 T 650 125 T 680 125 T 710 125 T 740 125"
          stroke="#4f46e5"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 5, delay: 1.5, ease: 'linear' }}
        />
        <motion.path
          d="M 60 100 C 150 150, 250 50, 350 100 S 550 180, 740 80"
          stroke="#a855f7"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 4, delay: 1, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 50 80 C 100 20, 150 150, 220 100 S 280 -20, 380 90 C 480 200, 500 50, 580 110 S 680 180, 750 60"
          stroke="url(#hero-gradient)"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.5, delay: 0.8, ease: 'easeInOut' }}
          style={{ filter: 'url(#glow)' }}
        />

        <motion.g
          initial="hidden"
          animate="show"
          variants={{
            show: { transition: { staggerChildren: 0.3, delayChildren: 2.5 } },
          }}
        >
          <motion.circle
            cx="220"
            cy="100"
            r="4"
            fill="white"
            variants={fadeIn()}
          />
          <motion.circle
            cx="580"
            cy="110"
            r="4"
            fill="white"
            variants={fadeIn()}
          />
          <motion.text
            x="600"
            y="40"
            fontFamily="monospace"
            fontSize="18"
            fill="rgba(255, 255, 255, 0.6)"
            variants={fadeIn()}
          >
            y = f(t)
          </motion.text>
          <motion.text
            x="100"
            y="155"
            fontFamily="monospace"
            fontSize="18"
            fill="rgba(255, 255, 255, 0.6)"
            variants={fadeIn()}
          >
            ΣF = ma
          </motion.text>
          <motion.text
            x="370"
            y="160"
            fontFamily="monospace"
            fontSize="14"
            fill="rgba(255, 255, 255, 0.4)"
            variants={fadeIn()}
          >
            (t₀, y₀)
          </motion.text>
        </motion.g>
      </svg>
    </div>
  );
};

export default HeroMathGraph;