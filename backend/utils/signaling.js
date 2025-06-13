function handleWebSocket(socket) {
  if (waiting) {
    const peer = waiting;
    waiting = null;

    socket.peer = peer;
    peer.peer = socket;

    socket.send(JSON.stringify({ type: "connected", role: "caller" }));
    peer.send(JSON.stringify({ type: "connected", role: "callee" }));
  } else {
    waiting = socket;
    socket.send(JSON.stringify({ type: "waiting" }));
  }

  socket.on("message", (data) => {
    if (socket.peer) socket.peer.send(data);
  });

  socket.on("close", () => {
    if (socket.peer) {
      socket.peer.send(JSON.stringify({ type: "disconnected" }));
      socket.peer.peer = null;
    } else waiting = null;
  });
}

module.exports = { handleWebSocket };
