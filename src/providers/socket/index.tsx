"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { authClient } from "@/lib/auth-client";

interface SocketEvents {
  "op:status_alterado": (data: any) => void;
  "maquina:status_alterado": (data: any) => void;
  "manutencao:status_alterado": (data: any) => void;
}

interface SocketContextValue {
  on: <K extends keyof SocketEvents>(event: K, handler: SocketEvents[K]) => void;
  off: <K extends keyof SocketEvents>(event: K, handler: SocketEvents[K]) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!authClient.token) return;

    const socket = io(
      `${process.env.NEXT_PUBLIC_WS_URL ?? process.env.NEXT_PUBLIC_API_URL}/ws`,
      {
        transports: ["websocket"],
        auth: { token: authClient.token },
      }
    );

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const on: SocketContextValue["on"] = (event, handler) => {
    socketRef.current?.on(event as string, handler);
  };

  const off: SocketContextValue["off"] = (event, handler) => {
    socketRef.current?.off(event as string, handler);
  };

  return (
    <SocketContext.Provider value={{ on, off }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket deve ser usado dentro de SocketProvider");
  return ctx;
}
