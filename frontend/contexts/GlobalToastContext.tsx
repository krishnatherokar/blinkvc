"use client";
import Confirm from "@/components/Confirm";
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

type ConfirmDialog = {
  text: string;
  confirmText: string;
  isRisky?: boolean;
};

type ToastContextType = {
  triggerToast: (message: messageType) => void;
  errorToast: (err: any) => void;
  confirm: (msg: ConfirmDialog) => Promise<boolean>;
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

  // confirm logic:

  const [dialog, setDialog] = useState<ConfirmDialog | null>(null);
  const [resolver, setResolver] = useState<((val: boolean) => void) | null>(
    null
  );

  const confirm = (input: ConfirmDialog): Promise<boolean> => {
    setDialog(input);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handle = (result: boolean) => {
    setDialog(null);
    resolver?.(result);
    setResolver(null);
  };

  const toastProps = { message, setMessage };
  const confirmProps = { dialog, handle };

  return (
    <ToastContext.Provider
      value={{ triggerToast: setMessage, errorToast, confirm }}
    >
      {children}
      <Toast {...toastProps} />
      <Confirm {...confirmProps} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("No context detected");
  return context;
};
