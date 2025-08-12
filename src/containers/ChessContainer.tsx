'use client';

import ChessPiece from ' @/components/ChessPiece';
import { cn } from ' @/utils/cn';
import { HTMLMotionProps, motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useState } from 'react';

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

export type ChessContainerProps = {
  index: number;
  iconHeight: number | string;
  gameOpen: boolean;
  onClick: () => void;
} & HTMLMotionProps<'div'>;

const ChessContainer = ({ index, iconHeight, gameOpen, onClick, ...MotionDivProps }: ChessContainerProps) => {
  const colors = ['bg-stone-300', 'bg-stone-500'];

  return (
    <motion.div
      className="flex flex-col items-center justify-between overflow-hidden border-2 font-semibold text-neutral-400"
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
        <h3 className="font-bangers font-semibold text-white">Chess</h3>
        <motion.button className="bg-black px-2 py-1 font-semibold text-white" onClick={() => onClick()}>
          close
        </motion.button>
      </div>

      <section className="relative aspect-square w-[95%]">
        <div
          className="absolute grid h-full w-full bg-neutral-700"
          style={{
            gridTemplateRows: `repeat(8, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(8, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: 64 }, (_, index) => (
            <div
              key={index}
              className={cn('h-full w-full', (Math.floor(index / 8) + (index % 8)) % 2 === 0 ? colors[0] : colors[1])}
            />
          ))}
        </div>
        <div
          className="absolute grid h-full w-full bg-transparent"
          style={{
            gridTemplateRows: `repeat(8, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(8, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: 32 }, (_, index) => (
            <ChessPiece key={index} id={index} />
          ))}
        </div>
      </section>
      <div></div>
      <div></div>
    </motion.div>
  );
};

export default ChessContainer;
