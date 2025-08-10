'use client';

import { LayoutGroup, motion } from 'motion/react';
import { useDeferredValue, useRef, useState } from 'react';

const DotSquare = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState<number>(0);
  const deferCount = useDeferredValue(count);
  console.log(deferCount);
  return (
    <motion.div
      ref={ref}
      className="flex-center relative h-full w-full flex-wrap justify-around rounded-2xl bg-blue-300 p-2"
      onClick={() => {
        if (deferCount >= 3) {
          setCount(4);
          setTimeout(() => setCount(1), 300);
        } else {
          setCount((prev) => prev + 1);
        }
      }}
    >
      <LayoutGroup id="groupRowPlusCol">
        {new Array(deferCount).fill(null).map((_, index) => (
          <motion.div
            layout
            layoutId={index + ''}
            key={index}
            className="rounded-[50%] bg-neutral-800"
            style={{
              height: (ref.current?.clientHeight || 10) / 3,
              width: (ref.current?.clientWidth || 10) / 3,
            }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.6 }}
          />
        ))}
      </LayoutGroup>
    </motion.div>
  );
};

export default DotSquare;
