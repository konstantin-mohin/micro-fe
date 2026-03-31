import { Link } from 'react-router-dom';
import { DataList } from './DataList';

export function ReactQueryPage() {
  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-extrabold text-purple-600 mb-8">React Query Demo</h1>
      <DataList />
      <div className="mt-8">
        <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
