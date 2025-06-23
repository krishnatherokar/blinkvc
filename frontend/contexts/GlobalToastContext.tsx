"use client";
import Toast from "@/components/Toast";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type messageType = {
  callerId?: string;
  alertType?: string;
  text: string;
};

type ToastContextType = {
  triggerToast: (message: messageType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<messageType | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 10000);
    return () => clearTimeout(timer);
  }, [message]);

  const toastProps = { message, setMessage };

  return (
    <ToastContext.Provider value={{ triggerToast: setMessage }}>
      {children}
      <Toast {...toastProps} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("No context detected");
  return context;
};
