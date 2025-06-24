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
  toastType?: string;
  text: string;
};

type ToastContextType = {
  triggerToast: (message: messageType) => void;
  errorToast: (err: any) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<messageType | null>(null);

  const errorToast = (err: any) => {
    setMessage({
      toastType: "error",
      text: err.response?.data || err.message,
    });
  };

  useEffect(() => {
    if (!message) return;
    let t = message.callerId ? 15000 : 3000;
    const timer = setTimeout(() => setMessage(null), t);
    return () => clearTimeout(timer);
  }, [message]);

  const toastProps = { message, setMessage };

  return (
    <ToastContext.Provider value={{ triggerToast: setMessage, errorToast }}>
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
