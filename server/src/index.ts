// src/index.ts
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';

console.log("🚀 Starting server...");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
  });  

app.get('/', (req: Request, res: Response) => {
  res.send('✅ Server is running with TypeScript!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
