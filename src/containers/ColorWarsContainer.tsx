'use client';

import DotSquare from ' @/components/DotSquare';
import { resetGame } from ' @/redux/features/colorWarsSlice';
import { useAppDispatch, useAppSelector } from ' @/redux/hooks';
import { HTMLMotionProps, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { COLORS, ICONS } from ' @/utils/constants';

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
      className="flex flex-col items-center justify-between overflow-hidden font-semibold text-neutral-400"
      style={{ backgroundImage: COLORS[index].bgImage }}
      {...MotionDivProps}
    >
      <div className="flex w-full items-center justify-between p-2">
        <motion.img
          className="flex-center top-0 left-0 z-10 rounded-full bg-contain bg-no-repeat"
          layout
          initial={false}
          animate={{
            width: gameOpen ? '6vh' : iconHeight,
            height: gameOpen ? '6vh' : iconHeight,
            borderRadius: gameOpen ? '0%' : '50%',
            position: gameOpen ? 'relative' : 'absolute',
          }}
          transition={MotionDivProps.transition}
          src={ICONS[index]}
        />
        <h3 className="font-bangers font-semibold text-white">{COLORS[index].name}</h3>
        <button
          className="bg-black px-2 py-1 font-semibold text-white"
          onClick={() => {
            dispatch(resetGame());
            onClick();
          }}
        >
          close
        </button>
      </div>

      {/* grid */}

      <div
        className="grid w-[90%] gap-1 rounded-md bg-neutral-700 p-1 *:aspect-square"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {cellItems.map((_, index) => (
          <DotSquare key={index} id={index} />
        ))}
      </div>

      <div></div>
    </motion.div>
  );
};

export default ColorWarsContainer;
