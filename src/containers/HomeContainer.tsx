'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import TextReveal from ' @/components/TextReveal';
import { AnimatePresence, motion } from 'motion/react';

const CircularLinks = lazy(() => import(' @/components/CircularLinks'));

const HomeContainer = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    document.getElementById('experiment-skeleton')!.style.display = 'none';
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (window.innerWidth > window.innerHeight) {
    return (
      <div className="font-montserrat flex-center flex-col text-center text-xl font-semibold text-white">
        <p>Open in Mobile or use Potrait mode (reduce window size)</p>
        <p>screen width must be smaller than height</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      {!isReady && (
        <motion.div
          key="TextReveal"
          className="absolute z-[1] h-full w-full bg-transparent"
          layout
          exit={{ x: '-101%', transition: { type: 'tween', delay: 2.2 } }}
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

export default HomeContainer;
