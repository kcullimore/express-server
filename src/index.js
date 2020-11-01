import { calculateLayout } from "./js/layoutUtils.js";

const element = document.createElement("div");
element.setAttribute("id", "layout-div");

let ws = new WebSocket("ws://0.0.0.0:8080");

/* ws.onopen = function(e) {
 *   console.log("Browser WS connection established.");
 * }; */
// console.log(output);
ws.onmessage = function(message) {
  // console.log(JSON.parse(message.data));
  const inputHTML = JSON.parse(message.data).message;
  element.innerHTML = inputHTML;
  document.body.appendChild(element);
  let output = calculateLayout(document);
  ws.send(output);
};
