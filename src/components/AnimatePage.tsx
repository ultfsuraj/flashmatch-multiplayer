'use client';

import { ReactNode } from 'react';
import { useNavigationContext } from ' @/components/NavigationContext';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { DELAY } from ' @/components/NavigationContext';

const AnimatePage = ({ children }: { children: ReactNode }) => {
  const { pending } = useNavigationContext();
  const pathname = usePathname();

  return (
    <AnimatePresence mode="popLayout">
      {!pending && (
        <motion.div
          className="bg-teal-100"
          key={pathname}
          layout
          initial={{ x: 20, borderRadius: '100%', width: '20%', height: '20%', opacity: 0 }}
          animate={{ x: 100, borderRadius: '0%', width: '40%', height: '40%', opacity: 1 }}
          exit={{ x: 20, borderRadius: '100%', width: '20%', height: '20%', opacity: 0 }}
          transition={{ ease: 'easeOut', duration: DELAY / 1000 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatePage;
