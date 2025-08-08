'use client';

import { useInView } from 'motion/react';
import { Suspense, useRef } from 'react';

const LazyComponent = ({
  children,
  parentRef,
}: {
  children: React.ReactNode;
  parentRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    root: parentRef,
    margin: '-20% 0% -20% 0%',
    amount: 0.5,
  });

  return (
    <div ref={ref}>
      {isInView ? (
        <Suspense
          fallback={<h3 className="content-center bg-black text-center font-semibold text-emerald-400">Loading...</h3>}
        >
          {children}
        </Suspense>
      ) : (
        <h3 className="content-center bg-black text-center font-semibold text-emerald-400">To load</h3>
      )}
    </div>
  );
};

export default LazyComponent;
