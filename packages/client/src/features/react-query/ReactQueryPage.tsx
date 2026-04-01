import { Link } from 'react-router-dom';
import { DataList } from './DataList';
import { PageTitle } from 'ui';

export function ReactQueryPage() {
  return (
    <div className="text-center mt-12">
      <PageTitle>React Query Demo</PageTitle>
      <DataList />
      <div className="mt-8">
        <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
