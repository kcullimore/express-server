import { calculateLayout } from "./js/layoutUtils.js";

let ws = new WebSocket("ws://0.0.0.0:8080");

ws.onmessage = function(msg) {
  const parsed_data = JSON.parse(msg.data);
  console.log(parsed_data);
  const { event, id, message } = parsed_data;

  if (event == "receipt") {
    console.log(`This WS session ID is: ${id}`);
  }

  if (event == "layout-engine") {
    console.log(
      `The following layoutEngine message was recieved from WS session ID ${id}: ${message}`
    );
    document.head.innerHTML = message.head[0];
    document.body.innerHTML = message.body[0];
    let layout = calculateLayout(document);
    const output = { event: "layout-csv", id: id, message: layout };
    console.log(
      `The following JSON object will be sent by this WS session: ${output}`
    );
    ws.send(JSON.stringify(output));
  }

  if (event == "disconnect") {
    console.log(`This WS session ID disconnected: ${id}`);
  }
};
