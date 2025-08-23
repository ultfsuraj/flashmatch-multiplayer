'use client';

import DotSquare from ' @/components/DotSquare';
import { resetGame } from ' @/redux/features/colorWarsSlice';
import { useAppDispatch, useAppSelector } from ' @/redux/hooks';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { GAMES, ICONS } from ' @/utils/constants';
import { cn } from ' @/utils/cn';
import Button from ' @/components/Button';

export type ColorWarsContainerProps = {
  index: number;
  iconHeight: number | string;
  gameOpen: boolean;
  onClick: () => void;
} & HTMLMotionProps<'div'>;

const ColorWarsContainer = ({ index, iconHeight, gameOpen, onClick, ...MotionDivProps }: ColorWarsContainerProps) => {
  const rows = useAppSelector((state) => state.colorWarsState.gameInfo.rows);
  const [cellItems, setCellItems] = useState(() => new Array(rows * rows).fill(null));
  const dispatch = useAppDispatch();

  useEffect(() => {
    setCellItems(new Array(rows * rows).fill(null));
  }, [rows]);

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-between overflow-hidden py-3 font-semibold text-neutral-200"
      style={{ backgroundImage: GAMES[index].bgImage }}
      {...MotionDivProps}
    >
      <div className="flex w-full items-center justify-between p-2">
        <motion.img
          className="flex-center pointer-events-none top-0 left-0 z-10 rounded-full bg-contain bg-no-repeat"
          layout
          initial={false}
          animate={{
            width: gameOpen ? '6vh' : iconHeight,
            height: gameOpen ? '6vh' : iconHeight,
            position: gameOpen ? 'relative' : 'absolute',
          }}
          transition={MotionDivProps.transition}
          src={ICONS[index]}
        />
        <h3 className="font-bangers font-semibold text-white">{GAMES[index].name}</h3>

        <Button
          text="close"
          onClick={() => {
            dispatch(resetGame());
            onClick();
          }}
          className="drop-shadow-xs drop-shadow-neutral-400"
        />
      </div>

      <TurnIndicator />
      {/* grid */}
      <AnimatePresence mode="popLayout">
        {gameOpen && (
          <div
            className="grid aspect-square w-[90%] gap-2 rounded-md bg-neutral-800 p-2 drop-shadow-xl drop-shadow-neutral-400"
            style={{
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${rows}, minmax(0, 1fr))`,
            }}
          >
            {cellItems.map((_, index) => (
              <DotSquare key={index} id={index} />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </motion.div>
  );
};

export default ColorWarsContainer;

function TurnIndicator() {
  const { turn, color1, color2 } = useAppSelector((state) => state.colorWarsState.gameInfo);
  return (
    <div className="flex-center font-montserrat gap-4">
      <span>Turn : </span>
      <div className={cn('h-5 w-7 rounded-sm', turn % 2 ? color1 : color2)}></div>
    </div>
  );
}
