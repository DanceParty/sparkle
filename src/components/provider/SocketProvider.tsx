import { ClientSocketType } from "@/types/socket";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

interface ISocketContext {
  socket: ClientSocketType | null;
  status: STATUS;
}

export enum STATUS {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  status: STATUS.DISCONNECT,
});
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<ClientSocketType | null>(null);
  const [status, setStatus] = useState(STATUS.DISCONNECT);

  useEffect(() => {
    const socketIo: ClientSocketType = io({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketIo.on("connect", () => {
      setStatus(STATUS.CONNECT);
    });

    socketIo.on("disconnect", () => {
      setStatus(STATUS.DISCONNECT);
    });

    setSocket(socketIo);

    return () => {
      if (socketIo) {
        socketIo.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, status }}>
      {children}
    </SocketContext.Provider>
  );
}
