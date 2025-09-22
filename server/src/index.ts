// server.ts (Node.js backend)
import express from 'express';
import cors from 'cors';
import budgetDataRoute from './BudgetController';
import { connectToDB } from './db';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use('/api', budgetDataRoute);

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

export {};