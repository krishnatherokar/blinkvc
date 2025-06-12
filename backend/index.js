const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const { handleWebSocket } = require("./utils/signaling");

const app = express();

app.use(express.json());

// configure dotenv
require("./config/dotenvconfig");

// set allowed request origins
app.use(
  cors({
    origin: process.env.CORS_ALLOWED,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization,Cache-Control",
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", handleWebSocket);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running!`);
});
