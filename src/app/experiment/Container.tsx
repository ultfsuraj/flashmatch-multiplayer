'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import TextReveal from ' @/components/TextReveal';
import { AnimatePresence, motion } from 'motion/react';

const CircularLinks = lazy(() => import(' @/components/CircularLinks'));

const Container = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    document.getElementById('experiment-skeleton')!.style.display = 'none';
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence mode="popLayout">
      {!isReady && (
        <motion.div
          key="TextReveal"
          className="absolute z-[1] h-full w-full bg-transparent"
          layout
          exit={{ x: '-100%', transition: { type: 'tween', delay: 2.2 } }}
        >
          <TextReveal key="homeText" text="Flash Match" />
        </motion.div>
      )}
      <Suspense fallback={null}>
        <CircularLinks isReady={() => setIsReady(true)} />
      </Suspense>
    </AnimatePresence>
  );
};

export default Container;
