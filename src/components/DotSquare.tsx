'use client';

import { AnimatePresence, LayoutGroup, motion, useAnimation } from 'motion/react';
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from 'react';
import { cn } from ' @/utils/cn';
import { increaseTurn, spread } from ' @/redux/features/colorWarsSlice';
import { useAppDispatch, useAppSelector } from ' @/redux/hooks';

const DotSquare = ({ id }: { id: number }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const cell = useAppSelector((state) => state.colorWarsState.cells[id]);
  const { count, flip, backColor, frontColor } = cell;
  const flipControls = useAnimation();

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (!isAnimating && count < 4) {
      dispatch(increaseTurn(id));
    }
  };

  useEffect(() => {
    const { count, id, flip } = cell;
    async function animateSpread() {
      await flipControls.start({ rotateY: flip, transition: { duration: 0.4 } });
      if (count > 3) {
        setTimeout(
          () => {
            dispatch(spread(id));
          },
          Math.round(100 + Math.random() * 200)
        );
      }
    }
    setIsAnimating(true);
    animateSpread();
  }, [cell, dispatch]);

  return (
    <div className="h-full w-full perspective-midrange" onClick={handleClick}>
      <motion.div
        layout
        className="relative h-full w-full transform-3d"
        animate={flipControls}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {/* front side */}
        <motion.div layout className={cn('absolute h-full w-full rounded-md p-1 backface-hidden', frontColor)}>
          <div ref={ref} className="flex-center h-full w-full flex-wrap justify-around">
            <LayoutGroup id={`front-${id}`}>
              {Array.from({ length: count % 5 }, (_, index) => (
                <motion.div
                  layout
                  layoutId={`${id}f${index}`}
                  key={index}
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
          className={cn('absolute h-full w-full -scale-x-100 rotate-y-180 rounded-md p-1 backface-hidden', frontColor)}
        >
          <div className="flex-center h-full w-full flex-wrap justify-around">
            <LayoutGroup id={`back-${id}`}>
              {Array.from({ length: count % 5 }, (_, index) => (
                <motion.div
                  layout
                  layoutId={`${id}b${index}`}
                  key={index}
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
