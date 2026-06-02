import React, { useRef } from 'react';
import { useBigListStore } from '../features/big-list/store';
import { Post } from 'shared';

export const TestStoreWrapper = ({ items, children }: { items: Post[], children: React.ReactNode }) => {
  const lastItemsRef = useRef<Post[] | null>(null);

  // Synchronously update the store if items have changed since the last render
  if (items !== lastItemsRef.current) {
    useBigListStore.getState().setItems(items);
    lastItemsRef.current = items;
  }

  return <>{children}</>;
};
