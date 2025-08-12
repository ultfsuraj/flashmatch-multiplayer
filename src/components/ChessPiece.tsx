'use client';

import { useAppSelector } from ' @/redux/hooks';
import { cn } from ' @/utils/cn';
import { motion } from 'motion/react';
import Image from 'next/image';

const ChessPiece = ({ id }: { id: number }) => {
  const piece = useAppSelector((state) => state.chessState.pieces[id]);
  const { color, name, x, y, url } = piece || {};
  return (
    <motion.div className="h-full w-full p-1" style={{ gridRowStart: y, gridColumnStart: x }}>
      <Image
        src={url}
        className={cn('h-full w-full')}
        alt={`${color ? 'white' : 'black'} ${name}`}
        width={70}
        height={70}
      />
    </motion.div>
  );
};

export default ChessPiece;
