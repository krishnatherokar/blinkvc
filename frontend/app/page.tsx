"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState("Loading...");
  useEffect(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000"
    );
    ws.onmessage = (e) => {
      let data = JSON.parse(e.data);
      setData("Received from server: " + data.message);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-blue-600">Hello there!</h1>
      <p className="mt-4 text-lg text-gray-700">{data}</p>
    </main>
  );
}
