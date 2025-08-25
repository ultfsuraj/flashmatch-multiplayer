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
            <h4 className="font-montserrat content-center rounded-md bg-black px-2 py-1 text-center font-semibold text-emerald-200">
              Loading
            </h4>
          }
        >
          {children}
        </Suspense>
      ) : (
        <h4 className="font-montserrat content-center rounded-md bg-black px-2 py-1 text-center font-semibold text-white">
          SWIPE
        </h4>
      )}
    </motion.div>
  );
};

export default LazyComponent;
