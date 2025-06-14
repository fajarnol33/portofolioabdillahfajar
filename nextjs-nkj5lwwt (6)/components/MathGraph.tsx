'use client';
import { motion } from 'framer-motion';

const MathGraph = () => {
  return (
    <div className="w-full max-w-md h-64 p-4 rounded-lg flex items-center justify-center">
      <svg
        viewBox="0 0 400 200"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 1. Definisi gradasi warna ditambahkan di sini */}
          <linearGradient
            id="experience-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: '#f472b6' }} />
            <stop offset="50%" style={{ stopColor: '#c026d3' }} />
            <stop offset="100%" style={{ stopColor: '#22d3ee' }} />
          </linearGradient>
        </defs>

        {/* Sumbu X dan Y */}
        <path
          d="M 50 190 L 380 190 M 50 10 L 50 190"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />

        {/* Garis kurva utama */}
        <motion.path
          d="M 50 150 Q 120 20, 200 100 T 350 50"
          fill="none"
          stroke="url(#experience-gradient)" // Menggunakan warna gradasi
          strokeWidth="3"
          // 2. Animasi diperbaiki agar lebih robust di mobile
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
};

export default MathGraph;
