'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<React.RefObject<Socket | null> | null>(null);

const SocketProvider = ({ url, children }: { url: string; children: React.ReactNode }) => {
  const socket = useRef<Socket>(null);
  useEffect(() => {
    if (socket.current == null) {
      socket.current = io(url);
    }
    return () => {
      socket.current?.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;

export const useSocket = () => useContext(SocketContext);
