import { Link, useLoaderData } from 'react-router-dom';
import { BigList } from './BigList';
import { PageTitle } from 'ui';
import { Suspense } from 'react';
import { bigListLoader } from './loader';

export function BigListPage() {
  const { itemsPromise } = useLoaderData<typeof bigListLoader>();
  
  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <div className="text-center mb-4 shrink-0">
        <PageTitle>BigList Demo</PageTitle>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <Suspense fallback={<div className="text-center p-8 text-muted-foreground">Loading big list...</div>}>
          <BigList itemsPromise={itemsPromise} />
        </Suspense>
      </div>
      <div className="mt-4 text-center shrink-0">
        <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
