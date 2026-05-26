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
let initializationPromise: Promise<void> | null = null;

async function initializePosts() {
  if (postsCache.length > 0) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
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
  })()
  return initializationPromise;
}

app.get('/api/posts', async (_req: Request, res: Response) => {
  await initializePosts();
  res.json(postsCache);
});

app.get('/api/posts/events', (_req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Prevent buffering by proxies like Nginx
  });
  res.flushHeaders();

  const clientId = Date.now();
  clients.push(res);
  console.log(`[SSE] Client ${clientId} connected. Total: ${clients.length}`);

  _req.on('close', () => {
    clients = clients.filter(client => client !== res);
    console.log(`[SSE] Client ${clientId} disconnected. Total: ${clients.length}`);
  });

  // CATCH ASYNC ERRORS: Fired when the TCP connection forcefully drops 
  res.on('error', (_err) => {
    console.warn(`[SSE] Client ${clientId} network error. Removing.`);
    clients = clients.filter(client => client !== res);
  });
});

setInterval(() => {
  if (postsCache.length > 0 && clients.length > 0) {
    const randomIndex = Math.floor(Math.random() * postsCache.length);
    const post = postsCache[randomIndex];
    post.likes += 1;

    const payload = JSON.stringify({ id: post.id, likes: post.likes });

    // Filter out destroyed clients while broadcasting to healthy ones
    clients = clients.filter(client => {
      // If the socket is dead or no longer writable, remove this client
      if (client.destroyed || client.writableEnded) {
        return false;
      }

      // Write returns false if there's a stream error/backpressure
      const success = client.write(`data: ${payload}\n\n`);
      return success; // Keep client if write was successfully buffered
    });
  }
}, 200);

// Send a heartbeat ping every 5 seconds
setInterval(() => {
  if (clients.length > 0) {
    clients = clients.filter(client => {
      if (client.destroyed || client.writableEnded) {
        return false;
      }
      return client.write('event: ping\ndata: {"ping":true}\n\n');
    });
  }
}, 5000);

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
