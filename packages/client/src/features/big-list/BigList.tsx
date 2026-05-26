import { use, useLayoutEffect } from "react";
import VirtualizedList from "../../components/VirtualizedList";
import { useBigListStore } from "./store";
import { useLivePosts } from "./useLivePosts";
import { type BigListLoaderData } from "./loader";

export function BigList({ itemsPromise }: BigListLoaderData) {
  const items = use(itemsPromise);

  useLayoutEffect(() => {
    useBigListStore.getState().setItems(items);
  }, [items]);

  useLivePosts();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <h1 className="text-2xl font-bold mb-4">Big List (Posts)</h1>
      <VirtualizedList />
    </div>
  );
}
