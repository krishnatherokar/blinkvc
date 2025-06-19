const { endCall } = require("./endCall");
const { handleRandomCall } = require("./handleRandomCall");

global.onlineMap = new Map();

function handleWebSocket(socket) {
  socket.on("message", (data) => {
    if (data instanceof Buffer) data = data.toString();
    data = JSON.parse(data);

    switch (data.type) {
      case "mark-online":
        socket.userId = data.user.id;
        socket.username = data.user.username;
        onlineMap.set(socket.userId, socket);
        break;
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
    onlineMap.delete(socket.userId);
    endCall(socket);
  });
}

module.exports = { handleWebSocket };
