"use client";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type WebSocketContextType = {
  ws: WebSocket | null;
  ready: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || count > 4) return;
    // limit the number of reconnection attempts

    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000"
    );

    wsRef.current = ws;

    ws.onopen = async () => {
      if (user) {
        ws.send(
          JSON.stringify({
            type: "mark-online",
            user: {
              id: user.id,
              username: user.username,
            },
          })
        );
      }
      setReady(true);
      // setReady is important to rerender the components
    };

    ws.onclose = () => {
      setReady(false);
      setCount((count) => count + 1);
      // retry connection
    };

    return () => {
      ws.close();
    };
  }, [count, isLoaded]);

  return (
    <WebSocketContext.Provider value={{ ws: wsRef.current, ready }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWSContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("No context detected");
  return context;
};
