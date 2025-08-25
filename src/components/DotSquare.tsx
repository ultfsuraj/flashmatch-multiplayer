'use client';

import { LayoutGroup, motion, useAnimation } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { cn } from ' @/utils/cn';
import { increaseTurn, spread } from ' @/redux/features/colorWarsSlice';
import { useAppDispatch, useAppSelector } from ' @/redux/hooks';
import { broadcastMove } from ' @/utils/wss';
import { useSocket } from ' @/containers/SocketProvider';

const DotSquare = ({ id, roomName }: { id: number; roomName: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const cell = useAppSelector((state) => state.colorWarsState.cells[id]);
  const { color, color1, color2, neutralColor, turn } = useAppSelector((state) => state.colorWarsState.gameInfo);
  const { count, frontColor } = cell;
  const flipControls = useAnimation();
  const socket = useSocket()?.current;

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if ((turn % 2 == 1) != color) return;
    if (turn > 2 && frontColor == neutralColor) return;
    if (frontColor == (color ? color2 : color1)) return;
    if (!isAnimating && count < 4) {
      dispatch(increaseTurn({ id, roomName }));
      if (socket) {
        // console.log('broadcasting move ', cell);
        broadcastMove(socket, 'makeMove', { id, roomName });
      } else {
        // console.log("no socket connection, move didn't reach opponent");
      }
    }
  };

  useEffect(() => {
    const { count, id, flip } = cell;
    async function animateSpread() {
      await flipControls.start({ rotateY: flip, transition: { duration: 0.5 } });
      if (count > 3) {
        dispatch(spread({ id, roomName }));
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
        <motion.div layout className={cn('absolute h-full w-full rounded-md p-1', frontColor)}>
          <div ref={ref} className="flex-center h-full w-full flex-wrap justify-around">
            <LayoutGroup id={`front-${id}`}>
              {Array.from({ length: count > 4 ? count - 4 : count }, (_, index) => (
                <motion.div
                  layout
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
        {/* <motion.div
          layout
          className={cn('absolute h-full w-full -scale-x-100 rotate-y-180 rounded-md p-1', frontColor)}
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
        </motion.div> */}
      </motion.div>
    </div>
  );
};

export default DotSquare;
