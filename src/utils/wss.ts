import { Events, Ack } from 'flashmatch-multiplayer-shared';
import { Socket } from 'socket.io-client';

export const joinRoom = (
  socket: Socket,
  evtName: Events['joinRoom']['name'],
  payload: Events['joinRoom']['payload'],
  callback: (order: number, error?: string) => void
) => {
  socket.emit(evtName, payload, (res: Ack) => {
    if (res.success) {
      callback(res.order || 0);
    } else {
      callback(-1, res.error);
    }
  });
};

export const broadcastMove = (
  socket: Socket,
  evtName: Events['makeMove']['name'],
  payload: Events['makeMove']['payload'],
  callback?: (order?: number) => void
) => {
  socket.emit(evtName, payload, (res: Ack) => {
    if (res.success) {
      if (callback) callback(res.order || 0);
    } else {
      // console.log(" couldn't send updated move, (update) should be reverted " + res.error);
    }
  });
};

export const broadcastGameState = (
  socket: Socket,
  evtName: Events['syncGameState']['name'],
  payload: Events['syncGameState']['payload'],
  callback?: (order?: number) => void
) => {
  socket.emit(evtName, payload, (res: Ack) => {
    if (res.success) {
      if (callback) callback(res.order || 0);
    } else {
      // console.log("Couldn't send gamestate for sync");
    }
  });
};

export const exitRoom = (
  socket: Socket,
  evtName: Events['exitRoom']['name'],
  payload: Events['exitRoom']['payload'],
  callback?: (order?: number) => void
) => {
  socket.emit(evtName, payload, (res: Ack) => {
    if (res.success) {
      if (callback) callback(res.order || 0);
    } else {
      // console.log(" couldn't send updated move, (update) should be reverted " + res.error);
    }
  });
};
