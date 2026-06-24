import { useQuery, useQueryClient, QueryStatus } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from 'ui';

interface User { id: number; name: string }
interface Project { id: number; userId: number; title: string }
interface Task { id: number; projectId: number; title: string }

const handleResponse = async (res: Response) => {
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};

export function DependentQueriesDemo() {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'idle' | 'waterfall' | 'optimized'>('idle');

  // --- Waterfall Queries ---
  const userWaterfall = useQuery<User>({
    queryKey: ['user', 'waterfall'],
    queryFn: () => fetch('/api/user').then(handleResponse),
    enabled: mode === 'waterfall',
    staleTime: 0,
  });

  const projectsWaterfall = useQuery<Project[]>({
    queryKey: ['projects', 'waterfall', userWaterfall.data?.id],
    queryFn: () => fetch(`/api/projects?userId=${userWaterfall.data?.id}`).then(handleResponse),
    enabled: !!userWaterfall.data?.id && mode === 'waterfall',
    staleTime: 0,
  });

  const firstProjectId = projectsWaterfall.data?.[0]?.id;
  const tasksWaterfall = useQuery<Task[]>({
    queryKey: ['tasks', 'waterfall', firstProjectId],
    queryFn: () => fetch(`/api/tasks?projectId=${firstProjectId}`).then(handleResponse),
    enabled: !!firstProjectId && mode === 'waterfall',
    staleTime: 0,
  });

  // --- Optimized Queries ---
  const userOptimized = useQuery<User>({
    queryKey: ['user', 'optimized'],
    queryFn: () => fetch('/api/user').then(handleResponse),
    enabled: mode === 'optimized',
    staleTime: 0,
  });

  // Both projects and tasks start as soon as user is loaded
  const projectsOptimized = useQuery<Project[]>({
    queryKey: ['projects', 'optimized', userOptimized.data?.id],
    queryFn: () => fetch(`/api/projects?userId=${userOptimized.data?.id}`).then(handleResponse),
    enabled: !!userOptimized.data?.id && mode === 'optimized',
    staleTime: 0,
  });

  const tasksOptimized = useQuery<Task[]>({
    queryKey: ['tasks', 'optimized', userOptimized.data?.id],
    queryFn: () => fetch(`/api/tasks?userId=${userOptimized.data?.id}`).then(handleResponse),
    enabled: !!userOptimized.data?.id && mode === 'optimized',
    staleTime: 0,
  });

  const reset = () => {
    setMode('idle');
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.removeQueries({ queryKey: ['projects'] });
    queryClient.removeQueries({ queryKey: ['tasks'] });
  };

  const isWaterfallLoading = userWaterfall.isFetching || projectsWaterfall.isFetching || tasksWaterfall.isFetching;
  const isOptimizedLoading = userOptimized.isFetching || projectsOptimized.isFetching || tasksOptimized.isFetching;

  return (
    <div className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-left">Dependent Queries</h2>

      <div className="flex gap-2 mb-6">
        <Button
          variant={mode === 'waterfall' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => { reset(); setMode('waterfall'); }}
          isDisabled={isWaterfallLoading || isOptimizedLoading}
        >
          Waterfall
        </Button>
        <Button
          variant={mode === 'optimized' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => { reset(); setMode('optimized'); }}
          isDisabled={isWaterfallLoading || isOptimizedLoading}
        >
          Optimized
        </Button>
        <Button variant="outline" size="sm" onClick={reset}>Reset</Button>
      </div>

      <div className="space-y-4 text-left">
        <QueryStep
          label="Step 1: Fetch User"
          status={mode === 'waterfall' ? userWaterfall.status : userOptimized.status}
          isFetching={mode === 'waterfall' ? userWaterfall.isFetching : userOptimized.isFetching}
          data={mode === 'waterfall' ? userWaterfall.data?.name : userOptimized.data?.name}
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <QueryStep
              label="Step 2: Projects"
              status={mode === 'waterfall' ? projectsWaterfall.status : projectsOptimized.status}
              isFetching={mode === 'waterfall' ? projectsWaterfall.isFetching : projectsOptimized.isFetching}
              data={mode === 'waterfall' ? `${projectsWaterfall.data?.length ?? 0} found` : `${projectsOptimized.data?.length ?? 0} found`}
            />
          </div>
          <div className="flex-1">
            <QueryStep
              label={mode === 'waterfall' ? "Step 3: Tasks (Dep on P1)" : "Step 2: Tasks (Dep on User)"}
              status={mode === 'waterfall' ? tasksWaterfall.status : tasksOptimized.status}
              isFetching={mode === 'waterfall' ? tasksWaterfall.isFetching : tasksOptimized.isFetching}
              data={mode === 'waterfall' ? `${tasksWaterfall.data?.length ?? 0} found` : `${tasksOptimized.data?.length ?? 0} found`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {mode === 'waterfall' ? (
            "Waterfall: Requests are sequential (A → B → C). Total time: ~2.4s"
          ) : mode === 'optimized' ? (
            "Optimized: Step 2 requests fire in parallel once Step 1 finishes. Total time: ~1.6s"
          ) : (
            "Select a mode to compare loading patterns in the Network tab."
          )}
        </p>
      </div>
    </div>
  );
}

function QueryStep({ label, status, isFetching, data }: { label: string, status: QueryStatus, isFetching: boolean, data?: string }) {
  const isActive = isFetching;
  const isDone = status === 'success' && !isFetching;

  return (
    <div className={`p-3 rounded-lg border transition-all ${isActive ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' :
        isDone ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
          'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
      }`}>
      <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">{label}</div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium dark:text-gray-200">{isDone ? data : isActive ? 'Fetching...' : 'Pending'}</div>
        {isActive && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
        {isDone && <div className="text-green-500 text-xs">✓</div>}
      </div>
    </div>
  );
}
