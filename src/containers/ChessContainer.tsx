'use client';

import { HTMLMotionProps, motion } from 'motion/react';

export type ChessContainerProps = {
  index: number;
  iconHeight: number | string;
  gameOpen: boolean;
  onClick: () => void;
} & HTMLMotionProps<'div'>;

const ChessContainer = ({ index, iconHeight, gameOpen, onClick, ...MotionDivProps }: ChessContainerProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-between overflow-hidden border-2 border-blue-800 font-semibold text-neutral-400"
      {...MotionDivProps}
    >
      <div className="flex w-full items-center justify-between p-2">
        <motion.div
          className="flex-center top-0 left-0 rounded-full"
          initial={false}
          animate={{
            height: gameOpen ? 'auto' : iconHeight,
            width: gameOpen ? 'auto' : iconHeight,
            borderRadius: gameOpen ? '0%' : '50%',
            position: gameOpen ? 'relative' : 'absolute',
          }}
          transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
          style={{
            backgroundImage: "url('https://www.flaticon.com/free-icon/hiring_10722382')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
        />
        <h3 className="font-bangers font-semibold text-white">Chess</h3>
        <motion.button className="bg-black px-2 py-1 font-semibold text-white" onClick={() => onClick()}>
          close
        </motion.button>
      </div>
      <section>ChessContainer {index}</section>
      <div></div>
    </motion.div>
  );
};

export default ChessContainer;
