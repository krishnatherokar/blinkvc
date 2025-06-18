const { endCall } = require("./endCall");
const { handleRandomCall } = require("./handleRandomCall");

function handleWebSocket(socket) {
  socket.on("message", (data) => {
    if (data instanceof Buffer) data = data.toString();
    data = JSON.parse(data);

    switch (data.type) {
      case "random-call":
        handleRandomCall({ socket });
        break;
      case "end-call":
        endCall(socket);
        break;

      default:
        if (socket.peer) socket.peer.send(JSON.stringify(data));
    }
  });

  socket.on("close", () => {
    endCall(socket);
  });
}

module.exports = { handleWebSocket };
