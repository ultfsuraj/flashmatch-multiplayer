'use client';

import { getMoves, updateKingCheck, updatePiece } from ' @/redux/features/chessSlice';
import { useAppDispatch, useAppSelector } from ' @/redux/hooks';
import { cn } from ' @/utils/cn';
import { motion } from 'motion/react';
import Image from 'next/image';

const ChessPiece = ({ id }: { id: number }) => {
  const piece = useAppSelector((state) => state.chessState.pieces[id]);
  const moves = useAppSelector((state) => state.chessState.moves[id]);
  const dispatch = useAppDispatch();

  const { color, name, x, y, url } = piece || {};

  return (
    <>
      <motion.div
        className="h-full w-full p-1"
        layout
        style={{ gridRowStart: y, gridColumnStart: x }}
        onClick={() => {
          dispatch(getMoves(id));
        }}
      >
        <Image
          src={url}
          className={cn('h-full w-full')}
          alt={`${color ? 'white' : 'black'} ${name}`}
          width={70}
          height={70}
        />
      </motion.div>
      {moves.map(({ x, y }, index) => (
        <div
          key={index}
          className="flex-center z-10 h-full w-full"
          style={{ gridRowStart: y, gridColumnStart: x }}
          onClick={() => {
            dispatch(updatePiece({ ...piece, x, y }));
            Promise.resolve().then(() => {
              dispatch(updateKingCheck(piece.color));
            });
          }}
        >
          <div className="h-[25%] w-[25%] rounded-full border border-amber-800 bg-amber-100 opacity-90"></div>
        </div>
      ))}
    </>
  );
};

export default ChessPiece;
