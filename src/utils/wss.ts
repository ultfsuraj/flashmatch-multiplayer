import { Events, Ack } from 'flashmatch-multiplayer-shared';
import { Socket } from 'socket.io-client';

export const joinRoom = (
  socket: Socket,
  evtName: Events['joinRoom']['name'],
  payload: Events['joinRoom']['payload']
) => {
  socket.emit(evtName, payload, (res: Ack) => {
    if (res.success) {
      // event was accepted by server, update UI
      console.log(payload.playerName + ' joined successfully in ' + payload.gameName);
    } else {
      // invalid move, or some error
      console.log(" couldn't join " + payload.playerName + res.error);
    }
  });
};
