'use client';

import { getMoves, updatePiece } from ' @/redux/features/chessSlice';
import { useAppDispatch, useAppSelector } from ' @/redux/hooks';
import { cn } from ' @/utils/cn';
import { HTMLMotionProps, motion } from 'motion/react';
import Image from 'next/image';

type ChessPieceProps = { pieceId: number } & HTMLMotionProps<'div'>;

const ChessPiece = ({ pieceId, ...MotionDivProps }: ChessPieceProps) => {
  const piece = useAppSelector((state) => state.chessState.pieces[pieceId]);
  const moves = useAppSelector((state) => state.chessState.moves[pieceId]);
  const dispatch = useAppDispatch();

  const { color, name, x, y, url } = piece || {};

  return (
    <>
      <motion.div
        className="h-full w-full p-1"
        layout
        style={{ gridRowStart: y, gridColumnStart: x }}
        {...MotionDivProps}
        onClick={() => {
          dispatch(getMoves(pieceId));
          Promise.resolve().then(() => {
            // dispatch();
            // socket emit game update
          });
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
      {moves.show &&
        moves.points.map(({ x, y }, index) => (
          <div
            key={index}
            className="flex-center z-10 h-full w-full"
            style={{ gridRowStart: y, gridColumnStart: x }}
            onClick={() => {
              dispatch(updatePiece({ ...piece, x, y }));
            }}
          >
            <div className="h-[25%] w-[25%] rounded-full border border-amber-800 bg-amber-100 opacity-90"></div>
          </div>
        ))}
    </>
  );
};

export default ChessPiece;
