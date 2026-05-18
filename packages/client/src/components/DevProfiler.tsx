import { Profiler, useState, useSyncExternalStore } from 'react';

interface ProfilerData {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualTime: number;
  baseTime: number;
}

interface DevProfilerProps {
  children: React.ReactNode;
  id: string;
}

function ProfilerOverlay({ data, onClose }: { data: ProfilerData | null; onClose: () => void }) {
  if (!data) return null;

  return (
    <div className="fixed top-28 right-4 z-50 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 rounded-lg p-3 shadow-lg text-xs font-mono max-w-xs">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-yellow-800 dark:text-yellow-200">
          ⚡ Profiler: {data.id}
        </span>
        <button
          onClick={onClose}
          className="ml-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
        >
          ✕
        </button>
      </div>
      <div className="text-yellow-800 dark:text-yellow-200 space-y-1">
        <div>Phase: {data.phase}</div>
        <div>Render: {data.actualTime.toFixed(2)}ms</div>
        <div>Base: {data.baseTime.toFixed(2)}ms</div>
      </div>
    </div>
  );
}

const profilerDataStore = {
  data: null as ProfilerData | null,
  subscribers: new Set<() => void>(),
  notify() {
    this.subscribers.forEach(fn => fn());
  },
  subscribe(fn: () => void) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  },
  getSnapshot() {
    return this.data;
  },
};

export function DevProfiler({ children, id }: DevProfilerProps) {
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dev_profiler_enabled') === 'true';
    }
    return false;
  });

  const handleToggle = () => {
    const nextValue = !isEnabled;
    setIsEnabled(nextValue);
    localStorage.setItem('dev_profiler_enabled', String(nextValue));
  };

  const handleOnRender = (
    _profilerId: string,
    _phase: 'mount' | 'update' | 'nested-update',
    _actualDuration: number,
    _baseDuration: number
  ) => {
    profilerDataStore.data = {
      id: _profilerId,
      phase: _phase,
      actualTime: _actualDuration,
      baseTime: _baseDuration,
    };
    profilerDataStore.notify();
  };

  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  return (
    <>
      <button
        onClick={handleToggle}
        className={`fixed top-14 right-4 z-50 rounded-lg px-3 py-2 text-xs font-mono shadow-lg transition-colors ${isEnabled
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
      >
        {isEnabled ? 'Disable Profiler' : 'Enable Profiler'}
      </button>

      {isEnabled ? (
        <>
          <Profiler id={id} onRender={handleOnRender}>
            {children}
          </Profiler>
          <ProfilerDisplay />
        </>
      ) : (
        children
      )}
    </>
  );
}

function ProfilerDisplay() {
  const data = useSyncExternalStore(
    (callback) => profilerDataStore.subscribe(callback),
    () => profilerDataStore.getSnapshot()
  );

  const [isManuallyClosed, setIsManuallyClosed] = useState(false);

  if (isManuallyClosed || !data) return null;

  return (
    <ProfilerOverlay
      data={data}
      onClose={() => setIsManuallyClosed(true)}
    />
  );
}
