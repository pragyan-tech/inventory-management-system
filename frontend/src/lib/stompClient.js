import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = "http://localhost:8080/ws";

let client = null;

export function getStompClient() {
  if (client) return client;

  client = new Client({

    webSocketFactory: () => new SockJS(WS_URL),

    reconnectDelay: 5000,

    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    debug: () => {},
  });

  client.activate();
  return client;
}

export function subscribe(topic, callback) {
  const c = getStompClient();
  let subscription = null;

  const subscribeNow = () => {
    subscription = c.subscribe(topic, (message) => {
      try {
        const payload = JSON.parse(message.body);
        callback(payload);
      } catch (e) {
        console.error("Failed to parse STOMP message:", e);
      }
    });
  };

  if (c.connected) {
    subscribeNow();
  } else {
    c.onConnect = (frame) => {
      subscribeNow();
    };
  }

  return () => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };
}