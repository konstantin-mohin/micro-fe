import { Link } from 'react-router-dom';
import { DataList } from './DataList';
import { OptimisticDemo } from './OptimisticDemo';
import { DependentQueriesDemo } from './DependentQueriesDemo';
import { PollingDemo } from './PollingDemo';
import { PageTitle } from 'ui';

export function ReactQueryPage() {
  return (
    <div className="text-center mt-12 px-4 pb-20">
      <PageTitle>React Query Demo</PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <DataList />
        <div className="space-y-8">
          <OptimisticDemo />
          <PollingDemo />
          <DependentQueriesDemo />
        </div>
      </div>

      <div className="h-[60vh]" />

      <div className="mt-8">
        <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
