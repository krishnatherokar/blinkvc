const handleRandomCall = ({ socket }) => {
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
};

module.exports = { handleRandomCall };
