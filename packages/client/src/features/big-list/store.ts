import { create } from "zustand";
import { Post } from "shared";

interface BigListState {
  items: Record<number, Post>;
  itemIds: number[];
  setItems: (items: Post[]) => void;
  updateItem: (id: number, updates: Partial<Post>) => void;
}

export const useBigListStore = create<BigListState>((set) => ({
  items: {},
  itemIds: [],
  setItems: (items) => {
    const itemsMap: Record<number, Post> = {};
    const ids: number[] = [];
    items.forEach((item) => {
      itemsMap[item.id] = item;
      ids.push(item.id);
    });
    set({ items: itemsMap, itemIds: ids });
  },
  updateItem: (id, updates) =>
    set((state) => {
      if (!state.items[id]) return {};
      return {
        items: {
          ...state.items,
          [id]: { ...state.items[id], ...updates },
        },
      };
    }),
}));
