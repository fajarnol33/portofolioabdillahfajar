'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface IntroAnimationProps {
  introText: string;
  onStart: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({
  introText,
  onStart,
}) => {
  const barControls = useAnimation();
  const textControls = useAnimation();
  const [isTextVisible, setIsTextVisible] = useState(false);

  useEffect(() => {
    barControls.start('visible');
  }, [barControls]);

  useEffect(() => {
    if (isTextVisible) {
      textControls.start('visible');
    }
  }, [isTextVisible, textControls]);

  const textLines = introText.split('\n').filter(Boolean);

  const barVariants = {
    hidden: { scaleY: 0, originY: 0.5 },
    visible: {
      scaleY: 1,
      transition: { duration: 0.5, ease: 'circOut' },
    },
  };

  const barContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const lineVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: textLines.length * 0.2 + 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      // Pastikan class 'intro-overlay' ada di sini
      className="intro-overlay fixed inset-0 bg-custom-dark flex items-center justify-center z-[1000] overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <motion.div
        className="absolute inset-0 flex h-full w-full"
        variants={barContainerVariants}
        initial="hidden"
        animate={barControls}
        onAnimationComplete={() => setIsTextVisible(true)}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className={`flex-1 h-full ${
              i % 2 === 0
                ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-500'
                : 'bg-gradient-to-tr from-gray-900 via-blue-900 to-cyan-500'
            }`}
            variants={barVariants}
          />
        ))}
      </motion.div>

      {isTextVisible && (
        <motion.div
          className="relative z-10 flex flex-col items-center text-center text-white p-4"
          variants={textContainerVariants}
          initial="hidden"
          animate={textControls}
        >
          {textLines.map((line, index) => (
            <motion.h1
              key={index}
              variants={lineVariants}
              className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
              style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
            >
              {line}
            </motion.h1>
          ))}
          <motion.div variants={buttonVariants}>
            <button
              onClick={onStart}
              className="mt-8 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Ketuk untuk Memulai
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default IntroAnimation;