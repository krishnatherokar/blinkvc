const endCall = (socket) => {
  if (socket.peer) {
    socket.peer.send(JSON.stringify({ type: "disconnected" }));
    socket.peer.peer = null;
    socket.peer = null;
  }

  if (waiting == socket) waiting = null;
};

module.exports = { endCall };
