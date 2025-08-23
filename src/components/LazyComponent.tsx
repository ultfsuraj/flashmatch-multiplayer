'use client';

import { useInView, HTMLMotionProps, motion } from 'motion/react';
import { Suspense, useRef } from 'react';

const LazyComponent = ({
  children,
  parentRef,
  ...MotionDivProps
}: {
  children: React.ReactNode;
  parentRef: React.RefObject<HTMLDivElement | null>;
} & HTMLMotionProps<'div'>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    root: parentRef,
    margin: '-20% 0% -20% 0%',
  });

  return (
    <motion.div ref={ref} {...MotionDivProps}>
      {isInView ? (
        <Suspense
          fallback={
            <h3 className="font-montserrat content-center rounded-md bg-black px-2 py-1 text-center font-semibold text-emerald-300">
              Loading..
            </h3>
          }
        >
          {children}
        </Suspense>
      ) : (
        <h3 className="font-montserrat content-center rounded-md bg-black px-2 py-1 text-center font-semibold text-white">
          SWIPE
        </h3>
      )}
    </motion.div>
  );
};

export default LazyComponent;
