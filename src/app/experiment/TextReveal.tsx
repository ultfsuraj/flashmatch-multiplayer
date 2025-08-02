'use client';

import { motion, useAnimation } from 'motion/react';
import { useEffect, useState } from 'react';

const TextReveal = ({ text }: { text: string }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const textControls = useAnimation();

  useEffect(() => {
    document.getElementById('experiment-skeleton')!.style.display = 'none';
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex-center relative h-[100vh] w-full bg-neutral-50">
      <motion.div
        className="absolute -top-1 h-[40vh] w-full rounded-md bg-black"
        initial={{ x: '-100%' }}
        animate={{ x: '-20%' }}
        transition={{
          duration: 2,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute top-0 right-[10%] w-1 rounded-md bg-black"
        initial={{ height: '0' }}
        animate={{ height: '50vh' }}
        transition={{
          duration: 2,
          ease: 'easeOut',
        }}
      />
      {/*  center text */}
      <motion.span
        className="font-bangers inline-block px-2 text-3xl font-semibold whitespace-nowrap"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{
          duration: 2,
          ease: 'easeOut',
        }}
      >
        {text}
      </motion.span>

      <motion.div
        className="absolute -bottom-1 h-[40vh] w-full rounded-md bg-black"
        initial={{ x: '100%' }}
        animate={{ x: '20%' }}
        transition={{
          duration: 2,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-[10%] w-1 rounded-md bg-black"
        initial={{ height: '0' }}
        animate={{ height: '50vh' }}
        transition={{
          duration: 2,
          ease: 'easeOut',
        }}
      />
    </div>
  );
};

export default TextReveal;
