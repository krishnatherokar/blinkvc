const sendCallReq = async (socket, targetId) => {
  const allowed = await checkFriends(socket, targetId);
  if (!allowed) return;

  const targetSocket = onlineMap.get(targetId);
  if (!targetSocket) {
    socket.send(
      JSON.stringify({ type: "call-response", response: "Peer offline" })
    );
  } else {
    targetSocket.send(
      JSON.stringify({
        type: "call-request",
        callername: socket.username,
        callerId: socket.userId,
      })
    );
    socket.send(JSON.stringify({ type: "call-response", response: "Ringing" }));
  }
};

const acceptCall = (socket, targetId) => {
  const targetSocket = onlineMap.get(targetId);
  if (!targetSocket) {
    socket.send(
      JSON.stringify({ type: "call-response", response: "Peer offline" })
    );
  } else {
    socket.peer = targetSocket;
    targetSocket.peer = socket;

    targetSocket.send(JSON.stringify({ type: "connected", role: "caller" }));
    socket.send(JSON.stringify({ type: "connected", role: "callee" }));
  }
};

const checkFriends = async (socket, targetId) => {
  let areFriends = await fetch(
    `${process.env.FRONTEND_URL}/api/call/checkfriends?idA=${targetId}&idB=${socket.userId}`
  );

  areFriends = await areFriends.text();
  if (areFriends != "friends") {
    socket.send(
      JSON.stringify({
        type: "call-response",
        response: "You must be friends to send a call request",
      })
    );
    return false;
  }

  return true;
};

module.exports = { sendCallReq, acceptCall };
