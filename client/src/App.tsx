import React, { useEffect, useState } from 'react';
import BudgetType from './Budget';
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
  const budgetId = "68cdf096c35077c8f92b1f98"; // hardcoded for now

  // useEffect(() => {
  //   fetch('http://localhost:5001/api/init', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     }
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       console.log("Created budget data");
  //       setLoading(false);
  //   })
  //   .catch((err) => {
  //     console.error("Failed to create budget data:", err);
  //     setLoading(false);
  //   });
  // }, []);

  useEffect(() => {
    fetch(`http://localhost:5001/api/budget/${budgetId}`)
      .then(response => response.json())
      .then((json: Budget) => {
        console.log("Fetched budget data:", json);
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
        <BudgetType budgetId={budgetId} incomeStreams={budget.incomeStreams} expenses={budget.expenses} />
      ): (
        <div>{loading ? "Loading..." : "Failed to load budget data."}</div>
      )}
    </div>
  );
}

export default App;
