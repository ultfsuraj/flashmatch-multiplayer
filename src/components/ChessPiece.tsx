'use client';

import { useSocket } from ' @/containers/SocketProvider';
import { getMoves, updatePiece } from ' @/redux/features/chessSlice';
import { useAppDispatch, useAppSelector } from ' @/redux/hooks';
import { cn } from ' @/utils/cn';
import { broadcastMove } from ' @/utils/wss';
import { HTMLMotionProps, motion } from 'motion/react';
import Image from 'next/image';

type ChessPieceProps = { pieceId: number } & HTMLMotionProps<'div'>;

const ChessPiece = ({ pieceId, ...MotionDivProps }: ChessPieceProps) => {
  const piece = useAppSelector((state) => state.chessState.pieces[pieceId]);
  const moves = useAppSelector((state) => state.chessState.moves[pieceId]);
  const dispatch = useAppDispatch();
  const socket = useSocket()?.current;

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
              // broadcast move, what payload is sent, that will be received, (full client side control)
              if (socket) {
                broadcastMove(socket, 'makeMove', { ...piece, x, y });
              } else {
                console.log("no socket connection, move didn't reach opponent");
              }
            }}
          >
            <div className="h-[25%] w-[25%] rounded-full border border-amber-800 bg-amber-100 opacity-90"></div>
          </div>
        ))}
    </>
  );
};

export default ChessPiece;
