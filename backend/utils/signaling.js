function handleWebSocket(socket) {
  socket.send(JSON.stringify({ type: "welcome", message: "Welcome!" }));

  setTimeout(() => {
    socket.send(JSON.stringify({ type: "goodbye", message: "Goodbye!" }));
    socket.close();
  }, 5000);
}

module.exports = { handleWebSocket };
