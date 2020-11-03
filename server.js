// General setup
const express = require("express");
const app = express();
const body = require("body-parser");
const cors = require("cors");
const path = require("path");
// const fs = require("fs");
const PUBLIC = path.join(__dirname, "assets");
const TMP_DIR = "/tmp";
// const DIST_DIR = path.join(__dirname, "./dist");
// const HTML_FILE = path.join(PUBLIC, "/html/input.html");

// Webpack setup
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("./webpack.config.js");
//reload=true:Enable auto reloading when changing JS files or content
//timeout=1000:Time from disconnecting from server to reconnecting
config.entry.app.unshift(
  "webpack-hot-middleware/client?reload=true&timeout=1000"
);
//Add HMR plugin
config.plugins.push(new webpack.HotModuleReplacementPlugin());
const compiler = webpack(config);

// Websocket setup
const WebSocket = require("ws");
const WS_PORT = 8080;
const uuid = require("node-uuid");
const client_list = [];

// Apply middleware to express server
app.use(webpackDevMiddleware(compiler, { path: config.output.path }));
app.use(webpackHotMiddleware(compiler));
app.use(cors());
app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.use(express.static(PUBLIC));
app.use(express.static(TMP_DIR));

// Setup server on PORT
const server = app.listen(WS_PORT, function() {
  console.log(`WS Server listening on http://0.0.0.0:${WS_PORT}\n`);
});

// Setup WebSocket
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  let client_uuid = uuid.v4();
  const new_client = { id: client_uuid, ws: ws };
  client_list.push(new_client);
  console.log(
    `client ${new_client.id} connected. ${client_list.length
    } clients connected.`
  );
  ws.send(JSON.stringify({ event: "receipt", id: client_uuid, message: "" }));

  ws.on("message", function messageHandler(data) {
    /* const parsed_data = JSON.parse(data.data);
     * const { event, id, message } = parsed_data;
     * if (event == "get-id") {
     *   client_list.forEach(client => {
     *     if (data.ws == client.ws) {
     *       client.ws.send(client.id);
     *     }
     *   });
     * } else { */
    client_list.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        console.log("Message recieved and sent by server");
        client.ws.send(data);
      }
    });
    /*     } */
  });

  ws.on("close", function closeWS() {
    client_list.forEach((client, i) => {
      if (client.id === new_client.id) {
        console.log(`client ${new_client.id} disconnected`);
        client_list.splice(i, 1);
      }
      ws.send(
        JSON.stringify({ event: "disconnect", id: new_client.id, message: "" })
      );
    });
  });
});

/* JSON.stringify({
 *   event: "message",
 *   id: new_client.id,
 *   message: data
 * }) */

/* ws.on("message", message => {
 *   console.log(`Received message: ${message}`);
 *   fs.writeFileSync(HTML_FILE, message);
 *   // fs.writeFileSync(path.join(__dirname, "test.txt"), message);
 *   ws.send("Message recieved!");
 * }); */

/* clients.forEach(function(value, i) {
 *
 *   if (clientSocket.readyState === WebSocket.OPEN) {
 *     clientSocket.send(
 *       JSON.stringify({
 *         event: "message",
 *         id: clients[i].id,
 *         message: message
 *       })
 *     );
 *   }
 * }); */
