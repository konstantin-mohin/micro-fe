import { useQuery } from '@tanstack/react-query';
import { useIntersectionObserver } from '../../lib/useIntersectionObserver';

interface LiveStats {
  activeUsers: number;
  requestsPerSecond: number;
  serverLoad: string;
  timestamp: string;
}

export function PollingDemo() {
  // 1. Setup the observer to track if the component is visible
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
  });

  // 2. Setup the query with dynamic polling
  const { data, isFetching } = useQuery<LiveStats>({
    queryKey: ['live-stats'],
    queryFn: () => fetch('/api/live-stats').then(res => {
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    }),
    // THE CORE LOGIC: Poll every 1 second ONLY if visible
    refetchInterval: isVisible ? 1000 : false,
    staleTime: 0,
  });

  return (
    <div 
      ref={containerRef as React.RefObject<HTMLDivElement>} 
      className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-colors max-w-md mx-auto overflow-hidden relative"
    >
      {/* Visibility Status Badge */}
      <div className={`absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${
        isVisible 
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
      }`}>
        {isVisible ? '● Visible' : '○ Off-screen'}
      </div>

      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100 text-left">Smart Polling</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-left leading-relaxed">
        This component polls the server every <strong>1s</strong>, but pauses automatically when you scroll it out of view.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          label="Active Users" 
          value={data?.activeUsers.toLocaleString()} 
          isUpdating={isFetching} 
        />
        <StatCard 
          label="Req / Second" 
          value={data?.requestsPerSecond.toString()} 
          isUpdating={isFetching} 
        />
        <StatCard 
          label="Server Load" 
          value={data?.serverLoad} 
          isUpdating={isFetching} 
        />
        <StatCard 
          label="Last Update" 
          value={data ? new Date(data.timestamp).toLocaleTimeString() : '--:--:--'} 
          isUpdating={isFetching} 
        />
      </div>

      <div className="mt-6 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className={`w-2 h-2 rounded-full ${isFetching ? 'bg-blue-500 animate-ping' : 'bg-blue-300 dark:bg-blue-700'}`} />
        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
          {isVisible ? 'Polling active...' : 'Polling paused (conserving resources)'}
        </span>
      </div>
    </div>
  );
}

function StatCard({ label, value, isUpdating }: { label: string; value?: string; isUpdating: boolean }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 transition-all">
      <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">{label}</div>
      <div className={`text-lg font-black dark:text-white transition-all duration-300 ${isUpdating ? 'scale-105 text-blue-600 dark:text-blue-400' : ''}`}>
        {value || '---'}
      </div>
    </div>
  );
}