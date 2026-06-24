import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface DemoItem {
  id: number;
  title: string;
  likes: number;
}

export function OptimisticDemo() {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: items, isLoading } = useQuery<DemoItem[]>({
    queryKey: ['demoItems'],
    queryFn: async () => {
      const response = await fetch('/api/demo-items');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/demo-items/${id}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Mutation failed');
      return response.json();
    },
    // When mutate is called:
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['demoItems'] });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<DemoItem[]>(['demoItems']);

      // Optimistically update to the new value
      if (previousItems) {
        queryClient.setQueryData<DemoItem[]>(['demoItems'], 
          previousItems.map(item => 
            item.id === id ? { ...item, likes: item.likes + 1 } : item
          )
        );
      }

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, id, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['demoItems'], context.previousItems);
      }
      setErrorMsg(`Failed to like item ${id}. Rolling back...`);
      setTimeout(() => setErrorMsg(null), 3000);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['demoItems'] });
    },
  });

  if (isLoading) return <div className="mt-8 text-gray-500 dark:text-gray-400">Loading demo...</div>;

  return (
    <div className="mt-12 p-6 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50 dark:bg-blue-900/20 max-w-md mx-auto transition-colors">
      <h2 className="text-xl font-bold mb-2 text-blue-800 dark:text-blue-200 text-left">Overlapping Mutations Challenge</h2>
      <p className="text-sm text-blue-600 dark:text-blue-300 mb-6 text-left">
        Try clicking the button rapidly 5-10 times. Watch for the <strong>flicker</strong> (due to invalidation) 
        and <strong>rollback</strong> (if a request fails).
      </p>

      {errorMsg && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded border border-red-200 dark:border-red-800 animate-bounce">
          {errorMsg}
        </div>
      )}

      <ul className="space-y-4">
        {items?.map((item) => (
          <li key={item.id} data-testid={`item-${item.id}`} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-blue-100 dark:border-blue-900/50 transition-colors">
            <div>
              <span className="font-medium text-gray-800 dark:text-gray-100">{item.title}</span>
              <div data-testid="likes-count" className="text-2xl font-black text-blue-600 dark:text-blue-400">{item.likes} Likes</div>
            </div>
            <button
              onClick={() => mutation.mutate(item.id)}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-full font-bold hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all shadow-md shadow-blue-200 dark:shadow-none disabled:bg-blue-300 dark:disabled:bg-blue-800"
            >
              👍 Like
            </button>
          </li>
        ))}
      </ul>
      
      <div className="mt-6 text-[10px] uppercase tracking-widest text-blue-400 dark:text-blue-500 font-bold">
        Server: 2s Delay | 30% Failure Rate
      </div>
    </div>
  );
}
