import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from the server!' });
});

app.get('/api/data', async (_req: Request, res: Response) => {
  // 1s delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  res.json({
    items: [
      { id: 1, name: 'Example Item 1', description: 'This is the first example item.' },
      { id: 2, name: 'Example Item 2', description: 'This is the second example item.' },
      { id: 3, name: 'Example Item 3', description: 'This is the third example item.' },
    ]
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
