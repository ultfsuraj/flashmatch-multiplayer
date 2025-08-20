'use client';

import ChessPiece from ' @/components/ChessPiece';
import { useSocket } from ' @/containers/SocketProvider';
import { pieceType, resetGame, syncGame, updateColor, updatePiece } from ' @/redux/features/chessSlice';
import { useAppDispatch, useAppSelector } from ' @/redux/hooks';
import { cn } from ' @/utils/cn';
import { GAMES, ICONS } from ' @/utils/constants';
import { broadcastGameState, exitRoom, joinRoom } from ' @/utils/wss';
import { Events, TimeOut } from 'flashmatch-multiplayer-shared';
import { AnimatePresence, easeInOut, HTMLMotionProps, motion } from 'motion/react';
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

export type ChessContainerProps = {
  index: number;
  iconHeight: number | string;
  gameOpen: boolean;
  onClick: () => void;
} & HTMLMotionProps<'div'>;

const ChessContainer = ({ index, iconHeight, gameOpen, onClick, ...MotionDivProps }: ChessContainerProps) => {
  // const colors = ['bg-neutral-100', 'bg-neutral-500'];
  const colors = ['bg-[#f0d9b5]', 'bg-[#b58863]'];
  const [white, setWhite] = useState<boolean>(true);
  const [joined, setJoined] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>(`suraj ${Math.round(Math.random() * 10)}`);
  const pieceIDs = useAppSelector((state) => state.chessState.pieceIDs);
  const pieces = useAppSelector((state) => state.chessState.pieces);
  const lastUpdated = useAppSelector((state) => state.chessState.gameInfo.lastUpdated);
  const turn = useAppSelector((state) => state.chessState.gameInfo.turn);
  const dispatch = useAppDispatch();
  const socket = useSocket()?.current;

  const makeMove: Events['makeMove']['name'] = 'makeMove';
  const makeMoveHandler = useCallback((payload: { id: number; x: number; y: number } & object) => {
    dispatch(updatePiece({ ...payload, id: payload.id, x: payload.x, y: payload.y }));
  }, []);

  const playerJoined: Events['playerJoined']['name'] = 'playerJoined';
  const playerJoinedHandler = useCallback((payload: Events['playerJoined']['payload']) => {
    console.log('Player ' + payload.order + ' ' + payload.playerName + ' joined');
    if (!socket) return;
    const prevState = JSON.parse(localStorage.getItem(GAMES[index].name) ?? '{"lastUpdated":-1,"state":{}}');
    console.log('broadcasting to new joiner ', prevState);
    if (prevState && prevState.lastUpdated) broadcastGameState(socket, 'syncGameState', prevState);
  }, []);

  const syncGameState: Events['syncGameState']['name'] = 'syncGameState';
  const syncGameHandler = useCallback(
    (
      payload: Events['syncGameState']['payload'] & {
        state: { turn: number; pieceIDs: number[]; pieces: Record<number, pieceType> };
      }
    ) => {
      console.log('received game state  ', payload);
      dispatch(syncGame(payload));
    },
    []
  );

  useEffect(() => {
    if (socket && gameOpen) {
      socket.on(playerJoined, playerJoinedHandler);
      socket.on(makeMove, makeMoveHandler);
      socket.on(syncGameState, syncGameHandler);
    }

    const payload = {
      gameName: GAMES[index].name,
      roomid: 'Room Input2',
      playerName: playerName,
    };

    const localState = JSON.parse(localStorage.getItem(GAMES[index].name) || '{"lastUpdated":-1,"state":{}}');
    if (Date.now() - localState.lastUpdated > TimeOut) {
      localStorage.removeItem(GAMES[index].name);
    }

    if (gameOpen && socket) {
      if (!joined) {
        joinRoom(socket, 'joinRoom', payload, (order: number) => {
          if (order == 2) {
            setWhite(false);
            dispatch(updateColor(false));
          }
          setJoined(true);
        });
      } else {
        if (localState && localState.lastUpdated) {
          broadcastGameState(socket, 'syncGameState', localState);
          console.log('synced from local ', localState);
          dispatch(syncGame(localState));
        }
      }
    }
    return () => {
      if (!socket) return;
      if (gameOpen && joined) {
        console.log('game closed');
        const exit: Events['exitRoom']['name'] = 'exitRoom';
        exitRoom(socket, exit, payload);
        setJoined(false);
        setWhite(true);
        dispatch(updateColor(true));
      }

      socket.off(makeMove, makeMoveHandler);
      socket.off(playerJoined, playerJoinedHandler);
      socket.off(syncGameState, syncGameHandler);
    };
  }, [gameOpen, joined]);

  return (
    <motion.div
      className="flex flex-col items-center justify-between overflow-hidden font-semibold text-neutral-400"
      style={{ backgroundImage: GAMES[index].bgImage }}
      {...MotionDivProps}
    >
      <div className="flex w-full items-center justify-between p-2">
        <motion.img
          className="flex-center top-0 left-0 z-10 rounded-full bg-contain bg-no-repeat"
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
        <h3 className="font-bangers font-semibold text-white">{GAMES[index].name}</h3>
        <motion.button
          className="bg-black px-2 py-1 font-semibold text-white"
          onClick={() => {
            // reset only if both party agrees, because click close then open again , and state has to be synced by opponent
            // dispatch(resetGame());
            onClick();
          }}
        >
          close
        </motion.button>
      </div>

      <AnimatePresence mode="popLayout">
        {gameOpen && (
          <motion.div
            className="relative aspect-square w-[95%]"
            animate={{ rotate: white ? 0 : 180 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
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
                  className={cn(
                    'h-full w-full',
                    (Math.floor(index / 8) + (index % 8)) % 2 === 0 ? colors[0] : colors[1]
                  )}
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
              {pieceIDs.map((id) => (
                <ChessPiece key={id} pieceId={id} animate={{ rotate: white ? 0 : 180 }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div></div>
      <div></div>
    </motion.div>
  );
};

export default ChessContainer;
