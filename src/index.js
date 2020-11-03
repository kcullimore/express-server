import { calculateLayout } from "./js/layoutUtils.js";

let ws = new WebSocket("ws://0.0.0.0:8080");

ws.onmessage = function(msg) {
  const parsed_data = JSON.parse(msg.data);
  console.log(parsed_data);
  const { event, id, message } = parsed_data;

  if (event == "receipt") {
    const my_id = id;
  }

  if (event == "message") {
    const parsed_message = JSON.parse(message);
    const new_html = parsed_message[0];
    console.log(new_html);
    document.head.innerHTML = new_html.head;
    document.body.innerHTML = new_html.body;
    let layout = calculateLayout(document);
    console.log(layout);
    ws.send(layout);
  }
};
