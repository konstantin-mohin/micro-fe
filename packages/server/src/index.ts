import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Post } from 'shared';

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

let postsCache: Post[] = [];
let clients: Response[] = [];

async function initializePosts() {
  if (postsCache.length > 0) return;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json() as any[];

    // Multiply the data 20 times to simulate a large list (2,000 items)
    postsCache = Array.from({ length: 20 }, (_, i) =>
      data.map(item => ({
        userId: item.userId,
        id: item.id + (i * data.length),
        title: item.title,
        body: item.body,
        likes: 0
      }))
    ).flat();
    console.log(`Initialized cache with ${postsCache.length} posts.`);
  } catch (error) {
    console.error("Failed to initialize posts cache:", error);
  }
}

app.get('/api/posts', async (_req: Request, res: Response) => {
  await initializePosts();
  res.json(postsCache);
});

app.get('/api/posts/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  clients.push(res);
  console.log(`[SSE] Client connected. Total: ${clients.length}`);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
    console.log(`[SSE] Client disconnected. Total: ${clients.length}`);
  });
});

// Broadcast randomized updates every 200ms
setInterval(() => {
  if (postsCache.length > 0 && clients.length > 0) {
    const randomIndex = Math.floor(Math.random() * postsCache.length);
    const post = postsCache[randomIndex];
    post.likes += 1;

    const payload = JSON.stringify({ id: post.id, likes: post.likes });

    clients.forEach(client => {
      client.write(`data: ${payload}\n\n`);
    });
  }
}, 200);

app.get('/api/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from the server!' });
});

import { Notes } from './components/Notes';

app.get('/api/notes', async (_req: Request, res: Response) => {
  try {
    // Calling the Server Component directly on the server
    const serverComponentPayload = await Notes();
    res.json(serverComponentPayload);
  } catch {
    res.status(500).json({ error: 'Server-Driven UI Render Error' });
  }
});

app.get('/api/data', (_req: Request, res: Response) => {
  res.json({
    items: [
      { id: 1, name: 'Item 1', description: 'This is item 1' },
      { id: 2, name: 'Item 2', description: 'This is item 2' },
    ],
  });
});

app.get('/api/random-number', (_req: Request, res: Response) => {
  const randomNumber = Math.floor(Math.random() * 1000) + 1;
  res.json({ number: randomNumber });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
