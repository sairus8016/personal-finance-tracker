import React, { useEffect, useState } from 'react';
import Budget from './Budget';
import './App.css';

interface IncomeStreamProps {
  key: number;
  name: string;
  frequency: number;
  amount: number;
}

interface Expenses {
  key: number;
  name: string;
  amount: number;
}

interface Budget {
    incomeStreams: IncomeStreamProps[];
    expenses: Expenses[];
}

function App() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/BudgetController')
      .then(response => response.json())
      .then((json: Budget) => {
        setBudget(json);
        setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch budget data:", err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="App">
      {budget ? (
        <Budget incomeStreams={budget.incomeStreams} expenses={budget.expenses} />
      ): (
        <div>{loading ? "Loading..." : "Failed to load budget data."}</div>
      )}
    </div>
  );
}

export default App;
