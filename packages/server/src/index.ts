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

// Mock database for Optimistic Updates Demo
const demoItems = [
  { id: 1, title: 'Optimistic Demo Item', likes: 0 },
];

async function initializePosts() {
  if (postsCache.length > 0) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");

      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }

      const data = await response.json() as { userId: number; id: number; title: string; body: string }[];

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
      initializationPromise = null; // Reset so we can retry on next request
      throw error;
    }
  })()
  return initializationPromise;
}

app.get('/api/posts', async (_req: Request, res: Response) => {
  try {
    await initializePosts();
    res.json(postsCache);
  } catch (error) {
    res.status(500).json({ error: `Failed to load posts: ${error}` });
  }
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
  res.on('error', (_err: Error) => {
    console.warn(`[SSE] Client ${clientId} ${_err.message} network error. Removing.`);
    clients = clients.filter(client => client !== res);
  });
});

setInterval(() => {
  if (postsCache.length > 0 && clients.length > 0) {
    const randomIndex = Math.floor(Math.random() * postsCache.length);
    const post = postsCache[randomIndex];
    post.likes += 1;

    const payload = JSON.stringify({ id: post.id, likes: post.likes });

    // Filter out destroyed or slow clients while broadcasting to healthy ones
    clients = clients.filter(client => {
      // 1. Check if the socket is physically dead
      if (client.destroyed || client.writableEnded) {
        return false;
      }

      /**
       * BACKPRESSURE HANDLING:
       * If the internal Node.js buffer (writableLength) is too high (> 512KB), 
       * the client is not reading fast enough. We drop them to prevent memory growth (memory leak).
       */
      const BACKPRESSURE_THRESHOLD = 512 * 1024; // 512KB
      if (client.writableLength > BACKPRESSURE_THRESHOLD) {
        console.warn(`[SSE] Dropping slow client due to backpressure (${client.writableLength} bytes buffered)`);
        client.destroy();
        return false;
      }

      // 2. Perform the write. 
      // Node.js will buffer the data if the network is busy.
      client.write(`data: ${payload}\n\n`);
      return true;
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
      client.write('event: ping\ndata: {"ping":true}\n\n');

      return true; // Keep client if write was successfully buffered
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

// --- Dependent Queries Demo Endpoints ---
const mockUser = { id: 1, name: 'Gemini User' };
const mockProjects = [
  { id: 101, userId: 1, title: 'Project Alpha' },
  { id: 102, userId: 1, title: 'Project Beta' },
];
const mockTasks = [
  { id: 1001, projectId: 101, title: 'Task 1.1' },
  { id: 1002, projectId: 101, title: 'Task 1.2' },
  { id: 2001, projectId: 102, title: 'Task 2.1' },
];

app.get('/api/user', async (_req, res) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  res.json(mockUser);
});

app.get('/api/projects', async (req, res) => {
  const userId = parseInt(req.query.userId as string);
  await new Promise(resolve => setTimeout(resolve, 800));
  if (userId === mockUser.id) {
    res.json(mockProjects);
  } else {
    res.json([]);
  }
});

app.get('/api/tasks', async (req, res) => {
  const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : null;
  const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
  
  await new Promise(resolve => setTimeout(resolve, 800));

  if (projectId) {
    res.json(mockTasks.filter(t => t.projectId === projectId));
  } else if (userId === mockUser.id) {
    // Optimized path: fetch all tasks for user's projects
    res.json(mockTasks);
  } else {
    res.json([]);
  }
});

app.get('/api/live-stats', (_req, res) => {
  res.json({
    activeUsers: Math.floor(Math.random() * 500) + 1000,
    requestsPerSecond: Math.floor(Math.random() * 50) + 200,
    serverLoad: (Math.random() * 40 + 10).toFixed(1) + '%',
    timestamp: new Date().toISOString()
  });
});
// ----------------------------------------

app.get('/api/demo-items', (_req: Request, res: Response) => {
  res.json(demoItems);
});

app.post('/api/demo-items/:id/like', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const item = demoItems.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  // Simulate network latency (2 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate random failure (30% chance)
  if (Math.random() < 0.3) {
    console.log(`[Demo] Simulating failure for item ${id}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  item.likes += 1;
  console.log(`[Demo] Item ${id} liked. Total likes: ${item.likes}`);
  res.json(item);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
