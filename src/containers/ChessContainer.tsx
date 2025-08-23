'use client';

import Button from ' @/components/Button';
import ChessPiece from ' @/components/ChessPiece';
import RoomJoinForm from ' @/components/RoomJoinForm';
import { useSocket } from ' @/containers/SocketProvider';
import { pieceType, resetGame, syncGame, updateColor, updatePiece } from ' @/redux/features/chessSlice';
import { useAppDispatch, useAppSelector } from ' @/redux/hooks';
import { cn } from ' @/utils/cn';
import { GAMES, ICONS } from ' @/utils/constants';
import { broadcastGameState, exitRoom, joinRoom } from ' @/utils/wss';
import { Events, TimeOut } from 'flashmatch-multiplayer-shared';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

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
  const [player1, setPlayer1] = useState<string>(``);
  const [player2, setPlayer2] = useState<string>(``);
  const [roomName, setRoomName] = useState<string>('Room1');
  const [joinError, setJoinError] = useState<string>('');
  const pieceIDs = useAppSelector((state) => state.chessState.pieceIDs);
  const { color, turn } = useAppSelector((state) => state.chessState.gameInfo);
  const dispatch = useAppDispatch();
  const socket = useSocket()?.current;

  const makeMove: Events['makeMove']['name'] = 'makeMove';
  const makeMoveHandler = useCallback((payload: { id: number; x: number; y: number } & object) => {
    dispatch(updatePiece({ ...payload, id: payload.id, x: payload.x, y: payload.y }));
  }, []);

  const playerJoined: Events['playerJoined']['name'] = 'playerJoined';
  const playerJoinedHandler = useCallback((payload: Events['playerJoined']['payload']) => {
    console.log('Player ' + payload.order + ' ' + payload.playerName + ' joined');
    setPlayer2(payload.playerName);
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

    const localState = JSON.parse(localStorage.getItem(GAMES[index].name) || '{"lastUpdated":-1,"state":{}}');
    if (Date.now() - localState.lastUpdated > TimeOut) {
      localStorage.removeItem(GAMES[index].name);
    }

    if (gameOpen && socket && joined) {
      if (localState && localState.lastUpdated) {
        broadcastGameState(socket, 'syncGameState', localState);
        console.log('synced from local ', localState);
        dispatch(syncGame(localState));
      }
    }
    return () => {
      if (!socket) return;
      if (gameOpen && joined) {
        console.log('game closed');
        const exit: Events['exitRoom']['name'] = 'exitRoom';
        exitRoom(socket, exit, { gameName: GAMES[index].name, playerName: player1, roomid: roomName });
        setJoined(false);
        setWhite(true);
        dispatch(updateColor(true));
        setPlayer1('');
        setPlayer2('');
      }

      socket.off(makeMove, makeMoveHandler);
      socket.off(playerJoined, playerJoinedHandler);
      socket.off(syncGameState, syncGameHandler);
    };
  }, [gameOpen, joined, player1, roomName]);

  return (
    <motion.div
      {...MotionDivProps}
      className="flex h-full w-full flex-col items-center justify-between overflow-hidden font-semibold text-neutral-400"
      style={{ backgroundImage: GAMES[index].bgImage }}
    >
      <div className="flex w-full items-center justify-between p-2 pt-3">
        <motion.img
          className="flex-center pointer-events-none top-0 left-0 z-10 rounded-full bg-contain bg-no-repeat"
          layout
          style={{ position: gameOpen ? 'relative' : 'absolute', left: 0, top: 0 }}
          initial={false}
          animate={{
            width: gameOpen ? '6vh' : iconHeight,
            height: gameOpen ? '6vh' : iconHeight,
          }}
          transition={MotionDivProps.transition}
          src={ICONS[index]}
        />
        <h3 className="font-bangers font-semibold text-white">{GAMES[index].name}</h3>
        <Button
          text="close"
          onClick={() => {
            // reset only if both party agrees, because click close then open again , and state has to be synced by opponent
            // dispatch(resetGame());
            onClick();
          }}
          className="drop-shadow-xs drop-shadow-neutral-400"
        />
      </div>

      <div className="font-montserrat flex-center gap-4 text-neutral-200">
        <div
          className={cn('h-5 w-7 rounded-sm', player2 && (turn % 2 == 1) != color ? 'bg-neutral-50' : 'bg-transparent')}
        ></div>
        <span> {player1 && !player2 ? 'waiting for opponent' : player2 ? `@ ${player2}` : ''}</span>
        <div className="w-7"></div>
      </div>
      <div className="aspect-square w-[95%] drop-shadow-2xl drop-shadow-amber-950">
        <AnimatePresence mode="wait">
          {gameOpen && (
            <motion.div
              className="relative h-full w-full"
              animate={{ rotate: white ? 0 : 180 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              exit={{ scale: 0.1, y: -100, transition: { type: 'spring', duration: 0.3, bounce: 0.1 } }}
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
              {/* join form */}
              {!joined && gameOpen && (
                <div className="flex-center h-full w-full drop-shadow-2xl">
                  <RoomJoinForm
                    onClick={(playerName, room) => {
                      if (room != roomName) {
                        localStorage.removeItem(GAMES[index].name);
                        dispatch(resetGame());
                      }
                      setRoomName(room);
                      if (socket)
                        joinRoom(
                          socket,
                          'joinRoom',
                          { gameName: GAMES[index].name, playerName, roomid: room },
                          (order: number, error?: string) => {
                            if (order == 2) {
                              setWhite(false);
                              dispatch(updateColor(false));
                            }
                            if (!error) {
                              setJoined(true);
                              setPlayer1(playerName);
                            } else {
                              setJoinError(error);
                              setTimeout(() => {
                                setJoinError('');
                              }, 2000);
                            }
                          }
                        );
                    }}
                    className="w-auto"
                    errMsg={joinError}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="font-montserrat flex-center gap-4 text-neutral-200">
        <div
          className={cn('h-5 w-7 rounded-sm', player1 && (turn % 2 == 1) == color ? 'bg-neutral-50' : 'bg-transparent')}
        ></div>
        <span>{player1 ? `@ ${player1}` : ''}</span>
        <div className="w-7"></div>
      </div>

      <div></div>
      <div></div>
      <div></div>
    </motion.div>
  );
};

export default ChessContainer;
