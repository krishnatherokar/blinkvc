const { handleRandomCall } = require("./handleRandomCall");

function handleWebSocket(socket) {
  let isRandomCall = false;

  socket.on("message", (data) => {
    if (data instanceof Buffer) data = data.toString();
    data = JSON.parse(data);

    if (data.type == "random-call") {
      isRandomCall = true;
      handleRandomCall({ socket });
    } else if (socket.peer) socket.peer.send(JSON.stringify(data));
  });

  socket.on("close", () => {
    if (socket.peer) {
      socket.peer.send(JSON.stringify({ type: "disconnected" }));
    } else if (isRandomCall) waiting = null;
  });
}

module.exports = { handleWebSocket };
