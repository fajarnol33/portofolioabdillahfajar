'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import AOSInit from './AOSInit';

const DynamicParticleBackground = dynamic(
  () => import('@/components/ParticleBackground'),
  { ssr: false }
);

const IntroAnimation = dynamic(() => import('@/components/IntroAnimation'), {
  ssr: false,
});

export default function PageWrapper({
  children,
  introText,
}: {
  children: React.ReactNode;
  introText: string;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [introFinished, setIntroFinished] = useState(!isHomePage);

  const handleStart = () => {
    setIntroFinished(true);
  };

  return (
    <>
      <AOSInit />
      <AnimatePresence>
        {!introFinished && (
          <IntroAnimation introText={introText} onStart={handleStart} />
        )}
      </AnimatePresence>

      {introFinished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <DynamicParticleBackground />
          <main>{children}</main>
        </motion.div>
      )}
    </>
  );
}