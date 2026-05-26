import { use, useLayoutEffect, useEffect } from "react";
import VirtualizedList from "../../components/VirtualizedList";
import { useBigListStore } from "./store";
import { Post } from "shared";

export interface BigListLoaderData {
  itemsPromise: Promise<Post[]>;
}

export function BigList({ itemsPromise }: BigListLoaderData) {
  const items = use(itemsPromise);

  useLayoutEffect(() => {
    useBigListStore.getState().setItems(items);
  }, [items]);

  useEffect(() => {
    const eventSource = new EventSource("/api/posts/events");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id && typeof data.likes === 'number') {
          useBigListStore.getState().updateItem(data.id, { likes: data.likes });
        }
      } catch (e) {
        console.error("[SSE Client] Error parsing data:", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <h1 className="text-2xl font-bold mb-4">Big List (Posts)</h1>
      <VirtualizedList />
    </div>
  );
}
