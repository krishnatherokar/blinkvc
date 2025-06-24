"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

interface UserContextType {
  user: any;
  loading: boolean;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const refreshUser = () => setCount((count) => count + 1);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user", {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
      setUser(res.data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) fetchUser();
  }, [isSignedIn, count]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error("No context detected");
  return context;
}
