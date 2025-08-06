'use client';

import { motion, useAnimate } from 'motion/react';
import { useEffect } from 'react';

const TextReveal = ({ text }: { text: string }) => {
  const [txtScope, txtAnimate] = useAnimate();

  useEffect(() => {
    setTimeout(async () => {
      await txtAnimate(
        txtScope.current,
        { clipPath: 'inset(0 30% 0 0)' },
        { type: 'spring', stiffness: 200, damping: 30, mass: 3 }
      );

      await txtAnimate(
        txtScope.current,
        { clipPath: 'inset(0 0% 0 0)' },
        { type: 'tween', ease: 'easeOut', duration: 0.3 }
      );
    }, 700);
  }, []);

  return (
    <div className="flex-center relative h-[100vh] w-full overflow-hidden bg-neutral-50" id="suraj">
      <motion.div
        className="absolute -top-1 h-[40vh] w-full rounded-md bg-black"
        initial={{ x: '-100%' }}
        animate={{ x: '-20%' }}
        transition={{
          duration: 1,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute top-0 right-[10%] w-1 rounded-md bg-black"
        initial={{ height: '0' }}
        animate={{ height: '50vh' }}
        transition={{
          duration: 1,
          ease: 'easeOut',
        }}
      />
      {/*  center text */}
      <motion.span
        ref={txtScope}
        className="font-bangers inline-block px-2 text-3xl font-semibold whitespace-nowrap"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
      >
        {text}
      </motion.span>

      <motion.div
        className="absolute -bottom-1 h-[40vh] w-full rounded-md bg-black"
        initial={{ x: '100%' }}
        animate={{ x: '20%' }}
        transition={{
          duration: 1,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-[10%] w-1 rounded-md bg-black"
        initial={{ height: '0' }}
        animate={{ height: '50vh' }}
        transition={{
          duration: 1,
          ease: 'easeOut',
        }}
      />
    </div>
  );
};

export default TextReveal;
