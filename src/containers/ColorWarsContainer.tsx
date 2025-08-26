'use client';

import DotSquare from ' @/components/DotSquare';
import { cellType, increaseTurn, resetGame, syncGame, updateColor } from ' @/redux/features/colorWarsSlice';
import { useAppDispatch, useAppSelector } from ' @/redux/hooks';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { GAMES, ICONS } from ' @/utils/constants';
import { cn } from ' @/utils/cn';
import Button from ' @/components/Button';
import { useSocket } from ' @/containers/SocketProvider';
import { Events, TimeOut } from 'flashmatch-multiplayer-shared';
import { broadcastGameState, exitRoom, joinRoom } from ' @/utils/wss';
import RoomJoinForm from ' @/components/RoomJoinForm';

export type ColorWarsContainerProps = {
  index: number;
  activeId: number;
  iconHeight: number | string;
  gameOpen: boolean;
  onClick: () => void;
} & HTMLMotionProps<'div'>;

const ColorWarsContainer = ({
  index,
  activeId,
  iconHeight,
  gameOpen,
  onClick,
  ...MotionDivProps
}: ColorWarsContainerProps) => {
  const [joined, setJoined] = useState<boolean>(false);
  const [player1, setPlayer1] = useState<string>(``);
  const [player2, setPlayer2] = useState<string>(``);
  const [roomName, setRoomName] = useState<string>('');
  const [joinError, setJoinError] = useState<string>('');
  const rows = useAppSelector((state) => state.colorWarsState.gameInfo.rows);
  const cellItems = useAppSelector((state) => state.colorWarsState.cells);
  const dispatch = useAppDispatch();
  const socket = useSocket()?.current;
  const storedRoom = JSON.parse(localStorage.getItem(GAMES[index].name) || '{"lastUpdated":-1,"state":{"roomName":""}}')
    .state.roomName;

  const makeMove: Events['makeMove']['name'] = 'makeMove';
  const makeMoveHandler = useCallback((payload: { id: number; roomName: string } & object) => {
    dispatch(increaseTurn({ id: payload.id, roomName: payload.roomName }));
  }, []);

  const playerJoined: Events['playerJoined']['name'] = 'playerJoined';
  const playerJoinedHandler = useCallback((payload: Events['playerJoined']['payload']) => {
    // console.log('Player ' + payload.order + ' ' + payload.playerName + ' joined');
    setPlayer2(payload.playerName);
    // console.log('inside COLOR WARS ');
    // console.log('player 2 ', GAMES[index].name);
    if (!socket) return;
    const prevState = JSON.parse(
      localStorage.getItem(GAMES[index].name) ?? '{"lastUpdated":-1,"state":{"roomName":""}}'
    );
    // console.log('broadcasting to new joiner ', prevState);
    if (prevState && prevState.lastUpdated) broadcastGameState(socket, 'syncGameState', prevState);
  }, []);

  const syncGameState: Events['syncGameState']['name'] = 'syncGameState';
  type GameState = {
    turn: number;
    roomName: string;
    cells: Record<number, cellType>;
    regions: { one: number; two: number };
  };
  const syncGameHandler = useCallback(
    (
      payload: Events['syncGameState']['payload'] & {
        state: GameState;
      }
    ) => {
      // console.log('received game state  ', payload);
      dispatch(syncGame(payload));
    },
    []
  );

  useEffect(() => {
    if (index != activeId) return;
    if (socket && gameOpen) {
      socket.on(playerJoined, playerJoinedHandler);
      socket.on(makeMove, makeMoveHandler);
      socket.on(syncGameState, syncGameHandler);
    }

    const localState = JSON.parse(
      localStorage.getItem(GAMES[index].name) || '{"lastUpdated":-1,"state":{"roomName":""}}'
    );
    if (Date.now() - localState.lastUpdated > TimeOut || (roomName.length && localState.state.roomName != roomName)) {
      localStorage.removeItem(GAMES[index].name);
    }
    // console.log('inside COLOR WARS ', GAMES[index].name);
    // console.log('from local storage on mount', localState);

    if (gameOpen && socket && joined) {
      if (localState && localState.lastUpdated) {
        broadcastGameState(socket, 'syncGameState', localState);
        // console.log('synced from local ', localState);
        if (localState.state.roomName == roomName) dispatch(syncGame(localState));
      }
    }

    return () => {
      if (gameOpen && joined) {
        // console.log('game closed');
        const exit: Events['exitRoom']['name'] = 'exitRoom';
        if (socket) exitRoom(socket, exit, { gameName: GAMES[index].name, playerName: player1, roomid: roomName });
        setJoined(false);
        setPlayer1('');
        setPlayer2('');
      }
      if (socket) {
        socket.off(makeMove, makeMoveHandler);
        socket.off(playerJoined, playerJoinedHandler);
        socket.off(syncGameState, syncGameHandler);
      }
    };
  }, [gameOpen, joined, player1, roomName]);

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-between overflow-hidden font-semibold text-neutral-200"
      style={{ backgroundImage: GAMES[index].bgImage }}
      {...MotionDivProps}
    >
      <div className="flex w-full items-center justify-between p-2 pt-3">
        <motion.img
          className="flex-center pointer-events-none top-0 left-0 z-10 rounded-full bg-contain bg-no-repeat"
          layout
          initial={false}
          animate={{
            width: gameOpen ? '6vh' : iconHeight,
            height: gameOpen ? '6vh' : iconHeight,
            position: gameOpen ? 'relative' : 'absolute',
          }}
          transition={MotionDivProps.transition}
          src={ICONS[index]}
        />
        <h3 className="font-bangers font-semibold text-white">{GAMES[index].name}</h3>

        <Button
          text="close"
          onClick={() => {
            // dispatch(resetGame());
            onClick();
          }}
          className="drop-shadow-xs drop-shadow-neutral-400"
        />
      </div>

      {/* grid */}
      <TurnIndicator player1={player1} player2={player2} bottom={false} />
      <div className="aspect-square w-[95%]">
        <AnimatePresence mode="wait">
          {gameOpen && (
            <motion.div
              className="flex-center relative h-full w-full"
              layout
              exit={{ scale: 0.1, y: -100, transition: { type: 'spring', duration: 0.3, bounce: 0.1 } }}
            >
              <div
                className="absolute grid aspect-square w-[90%] gap-2 rounded-md bg-neutral-800 p-2 drop-shadow-xl drop-shadow-neutral-400"
                style={{
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                  gridTemplateColumns: `repeat(${rows}, minmax(0, 1fr))`,
                }}
              >
                {Object.values(cellItems).map((cell) => (
                  <DotSquare key={cell.id} id={cell.id} roomName={roomName} />
                ))}
              </div>
              {/* join form */}
              {!joined && gameOpen && (
                <div className="flex-center absolute z-10 h-full w-full drop-shadow-2xl">
                  <RoomJoinForm
                    onClick={(playerName, room) => {
                      setRoomName(room);
                      if (socket)
                        joinRoom(
                          socket,
                          'joinRoom',
                          { gameName: GAMES[index].name, playerName, roomid: room },
                          (order: number, error?: string) => {
                            if (!error) {
                              setJoined(true);
                              setPlayer1(playerName);
                              if (room != (storedRoom || roomName)) {
                                localStorage.removeItem(GAMES[index].name);
                                dispatch(resetGame());
                              }
                              if (order == 2) {
                                // console.log('--- ', order, playerName);
                                dispatch(updateColor(false));
                              }
                              if (order == 1) {
                                // console.log('--- ', order, playerName);
                                dispatch(updateColor(true));
                              }
                            } else {
                              setJoinError(error);
                              setTimeout(() => {
                                setJoinError('');
                              }, 2000);
                            }
                          }
                        );
                    }}
                    className="w-[75%]"
                    errMsg={joinError}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <TurnIndicator player1={player1} player2={player2} bottom={true} />

      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </motion.div>
  );
};

export default ColorWarsContainer;

function TurnIndicator({ player1, player2, bottom }: { player1: string; player2: string; bottom: boolean }) {
  const { turn, color, color1, color2 } = useAppSelector((state) => state.colorWarsState.gameInfo);
  // console.log({ player1, player2, color });
  return (
    <>
      {bottom && (
        <div className="font-montserrat flex-center gap-4 text-neutral-200">
          <div
            className={cn(
              'h-5 w-7 rounded-sm',
              player1 && (turn % 2 == 1) == color ? (color ? color1 : color2) : 'bg-transparent'
            )}
          ></div>
          <span>{player1 ? `@ ${player1}` : ''}</span>
          <div className="w-7"></div>
        </div>
      )}
      {!bottom && (
        <div className="font-montserrat flex-center gap-4 text-neutral-200">
          <div
            className={cn(
              'h-5 w-7 rounded-sm',
              player2 && (turn % 2 == 1) != color ? (color ? color2 : color1) : 'bg-transparent'
            )}
          ></div>
          <span> {player1 && !player2 ? 'waiting for opponent' : player2 ? `@ ${player2}` : ''}</span>
          <div className="w-7"></div>
        </div>
      )}
    </>
  );
}
