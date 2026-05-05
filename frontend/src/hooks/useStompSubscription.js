import { useEffect } from "react";
import { subscribe } from "../lib/stompClient";


export function useStompSubscription(topic, onMessage) {
  useEffect(() => {
    const unsubscribe = subscribe(topic, onMessage);
    return unsubscribe;
  }, [topic, onMessage]);
}