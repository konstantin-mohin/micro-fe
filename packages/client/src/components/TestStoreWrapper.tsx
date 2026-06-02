import React, { useEffect } from 'react';
import { useBigListStore } from '../features/big-list/store';

export const TestStoreWrapper = ({ items, children }: { items: any[], children: React.ReactNode }) => {
  useEffect(() => {
    useBigListStore.getState().setItems(items);
  }, [items]);

  return <>{children}</>;
};
