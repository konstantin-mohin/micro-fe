import { useEffect, useRef } from "react";
import { useBigListStore } from "./store";

export function useLivePosts() {
  const alertShownRef = useRef(false);
  const lastPingTimeRef = useRef<number>(Date.now());
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connect = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Close existing connection before creating a new one
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      console.log("[SSE] Connecting to live updates...");
      const eventSource = new EventSource("/api/posts/events");
      eventSourceRef.current = eventSource;
      lastPingTimeRef.current = Date.now();

      eventSource.onopen = () => {
        console.log("[SSE] Connection established.");
        alertShownRef.current = false;
        lastPingTimeRef.current = Date.now();
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.id && typeof data.likes === "number") {
            useBigListStore.getState().updateItem(data.id, { likes: data.likes });
          }
        } catch (e) {
          console.error("[SSE] Error parsing data:", e);
        }
      };

      eventSource.onerror = () => {
        console.error("[SSE] EventSource connection failed.");
        handleFailure();
      };

      eventSource.addEventListener("ping", () => {
        lastPingTimeRef.current = Date.now();
      });
    };

    const handleFailure = (msg = "Live updates disconnected. We will try to reconnect.") => {
      if (!alertShownRef.current) {
        window.alert(msg);
        alertShownRef.current = true;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      // Schedule reconnection if not already scheduled
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null;
          connect();
        }, 5000);
      }
    };

    // Single interval to check connection health (heartbeat)
    const healthCheckInterval = setInterval(() => {
      const timeSinceLastPing = Date.now() - lastPingTimeRef.current;
      // If no ping for 15 seconds (server sends every 5s), assume connection is dead
      if (timeSinceLastPing > 15000 && eventSourceRef.current) {
        console.warn("[SSE] Heartbeat lost. Reconnecting...");
        handleFailure("Live updates connection timed out (heartbeat lost).");
      }
    }, 5000);

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      clearInterval(healthCheckInterval);

      //It is recommended to clear the items in the store when the component unmounts.
      useBigListStore.setState({ items: {}, itemIds: [] });
    };
  }, []);
}
