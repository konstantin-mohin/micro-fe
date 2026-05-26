import { Post } from 'shared';

export interface BigListLoaderData {
  itemsPromise: Promise<Post[]>;
}

export function bigListLoader(): BigListLoaderData {
  const itemsPromise = fetch("/api/posts")
    .then(res => res.json())
    .then((data: Post[]) => data);
  return { itemsPromise };
}
