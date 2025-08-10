'use client';

import { LayoutGroup, motion } from 'motion/react';
import { useDeferredValue, useRef, useState } from 'react';

const DotSquare = ({ id }: { id: number }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState<number>(0);
  const deferCount = useDeferredValue(count);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setCount((prev) => (prev >= 4 ? 1 : prev + 1));
      if (count >= 4) {
        setIsAnimating(true);
        setIsFlipped(!isFlipped);
      }
    }
  };

  return (
    <div className="h-full w-full perspective-midrange" onClick={handleFlip}>
      <motion.div
        layout
        className="relative h-full w-full transform-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.3,
        }}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {/* front side */}
        <motion.div layout className="absolute h-full w-full rounded-md bg-blue-300 p-2 backface-hidden">
          <div ref={ref} className="flex-center h-full w-full flex-wrap justify-around">
            <LayoutGroup id="groupRowPlusColFront">
              {new Array(deferCount).fill(null).map((_, index) => (
                <motion.div
                  layout
                  layoutId={id + 'front' + index}
                  key={id + 'front' + index}
                  className="rounded-[50%] bg-neutral-800"
                  style={{
                    height: (ref.current?.clientHeight || 10) / 3 + 1,
                    width: (ref.current?.clientWidth || 10) / 3 + 1,
                  }}
                  transition={{ type: 'spring', duration: 0.2 }}
                />
              ))}
            </LayoutGroup>
          </div>
        </motion.div>
        {/* back side */}
        <motion.div
          layout
          className="absolute h-full w-full -scale-x-100 rotate-y-180 rounded-md bg-red-300 p-2 backface-hidden"
        >
          <div className="flex-center h-full w-full flex-wrap justify-around">
            <LayoutGroup id="groupRowPlusColBack">
              {new Array(deferCount).fill(null).map((_, index) => (
                <motion.div
                  layout
                  layoutId={id + 'back' + index}
                  key={id + 'back' + index}
                  className="rounded-[50%] bg-neutral-800"
                  style={{
                    height: (ref.current?.clientHeight || 10) / 3 + 1,
                    width: (ref.current?.clientWidth || 10) / 3 + 1,
                  }}
                  transition={{ type: 'spring', duration: 0.2 }}
                />
              ))}
            </LayoutGroup>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DotSquare;
