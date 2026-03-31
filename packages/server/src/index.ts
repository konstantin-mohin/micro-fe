import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from the server!' });
});

import { Notes } from './components/Notes';

app.get('/api/notes', async (_req: Request, res: Response) => {
  try {
    // Calling the Server Component directly on the server
    const serverComponentPayload = await Notes();
    res.json(serverComponentPayload);
  } catch (error) {
    res.status(500).json({ error: 'RSC Render Error' });
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

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
