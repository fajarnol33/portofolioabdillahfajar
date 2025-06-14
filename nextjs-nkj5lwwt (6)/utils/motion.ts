// utils/motion.ts

export const fadeIn = (
  direction = 'up',
  type = 'tween',
  delay = 0,
  duration = 1.2
) => ({
  hidden: {
    x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
    y: direction === 'up' ? 80 : direction === 'down' ? -80 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type,
      delay: delay,
      duration: duration,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  },
});

export const staggerContainer = (staggerChildren = 0.3, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerChildren,
      delayChildren: delayChildren,
    },
  },
});

export const bounceIn = {
  hidden: { y: -50, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 14 },
  },
};

export const zoomIn = (delay = 0, duration = 0.7) => ({
  hidden: { scale: 0.9, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: 'tween', delay, duration, ease: 'easeOut' },
  },
});
