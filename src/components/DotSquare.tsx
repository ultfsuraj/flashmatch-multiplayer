'use client';

import { LayoutGroup, motion } from 'motion/react';
import { memo, useDeferredValue, useEffect, useRef, useState } from 'react';
import { cn } from ' @/utils/cn';
import { increaseTurn, type cellType } from ' @/redux/features/colorWarsSlice';
import { useAppDispatch } from ' @/redux/hooks';

const DotSquare = ({ id, flip, count: initialCount, frontColor, backColor }: cellType) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState<number>(initialCount);
  const deferCount = useDeferredValue(count);
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (!isAnimating) {
      dispatch(increaseTurn(id));
      if (count < 4) setCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (deferCount == 4) {
      setTimeout(() => {
        console.log('spread');
        // dispatch(spread(id))
      }, 200);
    }
  }, [deferCount]);

  return (
    <div className="h-full w-full perspective-midrange" onClick={handleClick}>
      <motion.div
        layout
        className="relative h-full w-full transform-3d"
        animate={{ rotateY: flip ? 180 : 0 }}
        transition={{
          duration: 0.3,
        }}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {/* front side */}
        <motion.div layout className={cn('absolute h-full w-full rounded-md p-1 backface-hidden', frontColor)}>
          <div ref={ref} className="flex-center h-full w-full flex-wrap justify-around">
            <LayoutGroup id="groupRowPlusColFront">
              {new Array(deferCount).fill(null).map((_, index) => (
                <motion.div
                  layout
                  layoutId={id + 'f' + index}
                  key={id + 'f' + index}
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
          className={cn('absolute h-full w-full -scale-x-100 rotate-y-180 rounded-md p-1 backface-hidden', backColor)}
        >
          <div className="flex-center h-full w-full flex-wrap justify-around">
            <LayoutGroup id="groupRowPlusColBack">
              {new Array(deferCount).fill(null).map((_, index) => (
                <motion.div
                  layout
                  layoutId={id + 'b' + index}
                  key={id + 'b' + index}
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

export default memo(DotSquare);
