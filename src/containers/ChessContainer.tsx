'use client';

import { HTMLMotionProps, motion } from 'motion/react';

export type ChessContainerProps = { index: number; onClick: () => void } & HTMLMotionProps<'div'>;

const ChessContainer = ({ index, onClick, ...MotionDivProps }: ChessContainerProps) => {
  return (
    <motion.div
      className="flex h-[100vh] w-[100vw] flex-col items-center justify-between overflow-hidden border-2 border-blue-800 font-semibold text-neutral-400"
      {...MotionDivProps}
    >
      <div className="flex w-full justify-between p-2">
        <div></div>
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
