'use client';

import DotSquare from ' @/components/DotSquare';
import { useAppSelector } from ' @/redux/hooks';
import { HTMLMotionProps, motion } from 'motion/react';

const ICONS: string[] = [
  'https://www.svgrepo.com/show/521343/crying-face.svg',
  'https://www.svgrepo.com/show/521344/confused-face.svg',
  'https://www.svgrepo.com/show/521348/drooling-face.svg',
  'https://www.svgrepo.com/show/521355/face-savoring-food.svg',
  'https://www.svgrepo.com/show/521366/face-with-rolling-eyes.svg',
  'https://www.svgrepo.com/show/521368/face-with-tears-of-joy.svg',
  'https://www.svgrepo.com/show/521378/grinning-face-with-big-eyes.svg',
  'https://www.svgrepo.com/show/521386/kissing-face.svg',
];

export type ColorWarsContainerProps = {
  index: number;
  iconHeight: number | string;
  gameOpen: boolean;
  onClick: () => void;
} & HTMLMotionProps<'div'>;

const ColorWarsContainer = ({ index, iconHeight, gameOpen, onClick, ...MotionDivProps }: ColorWarsContainerProps) => {
  const rows = useAppSelector((state) => state.colorWarsState.rows);
  const cells = useAppSelector((state) => state.colorWarsState.cells);

  return (
    <motion.div
      className="flex flex-col items-center justify-between overflow-hidden font-semibold text-neutral-400"
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
        <h3 className="font-bangers font-semibold text-white">Color Wars</h3>
        <motion.button className="bg-black px-2 py-1 font-semibold text-white" onClick={() => onClick()}>
          close
        </motion.button>
      </div>

      {/* grid */}

      <div
        className="grid w-[90%] gap-1 rounded-md bg-neutral-700 p-1 *:aspect-square"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((props) => (
          <DotSquare key={props.id} {...props} />
        ))}
      </div>

      <div></div>
    </motion.div>
  );
};

export default ColorWarsContainer;
