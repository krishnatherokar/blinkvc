"use client";
import { useUser } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useToast } from "./GlobalToastContext";
import axios from "axios";

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
  const { triggerToast } = useToast();

  const callAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    callAudioRef.current = new Audio("/sounds/notifSound.mp3");
    callAudioRef.current.preload = "auto";
    callAudioRef.current.volume = 0.8;
  }, []);

  const playNotifSound = useCallback(() => {
    if (callAudioRef.current) {
      callAudioRef.current.currentTime = 0;
      callAudioRef.current.play().catch(() => {});
    }
  }, []);

  const ping = async () => {
    await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
    );
  };

  useEffect(() => {
    if (!isLoaded || count > 4) return;
    // limit the number of reconnection attempts

    ping();
    // wake up the server

    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000"
    );

    const handleGlobalMessage = async (event: MessageEvent) => {
      const text =
        event.data instanceof Blob ? await event.data.text() : event.data;
      const data = JSON.parse(text);

      switch (data.type) {
        case "call-request":
          triggerToast({
            callerId: data.callerId,
            text: `Call from @${data.callername}`,
          });
          break;
        case "chat":
          playNotifSound();
          break;
      }
    };

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

    ws.addEventListener("message", handleGlobalMessage);

    ws.onclose = () => {
      setReady(false);
      setCount((count) => count + 1);
      // retry connection
    };

    return () => {
      ws.removeEventListener("message", handleGlobalMessage);
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
