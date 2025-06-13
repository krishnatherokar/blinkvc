const handleWebSocket = ({ setData }) => {
  const ws = new WebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000"
  );

  ws.onmessage = async (event) => {
    const text =
      event.data instanceof Blob ? await event.data.text() : event.data;
    const data = JSON.parse(text);

    switch (data.type) {
      case "waiting":
        setData("Server waiting for a peer...");
        break;

      case "connected":
        setData("Connected to a peer!");
        if (data.role === "caller") {
          ws.send(JSON.stringify({ message: "Hello from caller!" }));
        }
        break;

      case "disconnected":
        setData("Peer disconnected");
        ws.close();
        break;

      default:
        setData(data.message);
    }
  };
};
export default handleWebSocket;
