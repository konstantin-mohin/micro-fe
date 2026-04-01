import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface DataItem {
  id: number;
  name: string;
  description: string;
}

export function DataList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['exampleData'],
    queryFn: async () => {
      const response = await axios.get('/api/data');
      return response.data;
    },
  });

  if (isLoading) return <div className="mt-4 animate-pulse text-gray-500">Loading example data...</div>;
  if (error) return <div className="mt-4 text-red-500">Error loading data</div>;

  return (
    <div className="mt-8 text-left max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Example Data (React Query)</h2>
      <ul className="space-y-3">
        {data.items.map((item: DataItem) => (
          <li key={item.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
