'use client';

import { HTMLMotionProps, motion } from 'motion/react';
import { GAMES, ICONS } from ' @/utils/constants';

export type NewGameContainerProps = {
  index: number;
  iconHeight: number | string;
  gameOpen: boolean;
  onClick: () => void;
} & HTMLMotionProps<'div'>;

const NewGameContainer = ({ index, iconHeight, gameOpen, onClick, ...MotionDivProps }: NewGameContainerProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-between overflow-hidden font-semibold text-neutral-900"
      style={{ backgroundImage: GAMES[index].bgImage }}
      {...MotionDivProps}
    >
      <div className="flex w-full items-center justify-between p-2">
        <motion.img
          className="flex-center top-0 left-0 rounded-full bg-cover bg-no-repeat"
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
        <h3 className="font-bangers text-white">New Game</h3>
        <motion.button className="bg-black px-2 py-1 text-white" onClick={() => onClick()}>
          close
        </motion.button>
      </div>
      <section className="text-white">Coming Soon ...</section>
      <div></div>
    </motion.div>
  );
};

export default NewGameContainer;
