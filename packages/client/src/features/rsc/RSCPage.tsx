import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ComponentTreeRenderer } from './ComponentTreeRenderer';
import { PageTitle } from 'ui';

export function RSCPage() {
  const { data: serverPayload, isLoading, error } = useQuery({
    queryKey: ['notes-rsc'],
    queryFn: async () => {
      const response = await axios.get('/api/notes');
      return response.data;
    },
  });

  return (
    <div className="text-center mt-12 max-w-2xl mx-auto">
      <PageTitle>React Server Components (Simulated)</PageTitle>
      <p className="mb-8 text-gray-600 dark:text-gray-400 italic">
        This is now a "True" Server Component: the server (Express) runs the 'Notes()'
        function, accesses the database directly, and sends a UI description to the client.
      </p>

      {isLoading && <div className="animate-pulse text-gray-500 text-center">Rendering RSC from server...</div>}
      {error && <div className="text-red-500 text-center">Failed to render RSC</div>}

      <div className="text-left space-y-4">
        {serverPayload && <ComponentTreeRenderer node={serverPayload} />}
      </div>

      <div className="mt-8">
        <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
