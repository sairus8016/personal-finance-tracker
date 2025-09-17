// server.ts (Node.js backend)
import express from 'express';
import cors from 'cors';
import budgetDataRoute from './BudgetController.ts';

const app = express();
app.use(cors());
app.use('/api', budgetDataRoute);
app.listen(5001, () => {
  console.log('Server running');
});

export {};