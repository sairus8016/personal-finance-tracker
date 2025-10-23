import React, { useEffect, useState } from 'react';
import BudgetType from './Budget';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import './App.css';

interface IncomeStreamProps {
  _id: string;
  name: string;
  frequency: number;
  amount: number;
}

interface Expenses {
  _id: string;
  name: string;
  amount: number;
}

interface Budget {
  _id: string,
  name: string,
  incomeStreams: IncomeStreamProps[];
  expenses: Expenses[];
}

function App() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);  
  const [loading, setLoading] = useState<boolean>(true);
  const [newBudgetName, setNewBudgetName] = useState("");
  // const budgetId = "68cdf096c35077c8f92b1f98"; // hardcoded for now

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

  const fetchBudgets = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/budget");
      const data = await response.json();
      // Normalize: always store an array
      if (Array.isArray(data)) {
        setBudgets(data);
      } else if (Array.isArray(data.budgets)) {
        setBudgets(data.budgets);
      } else if (data) {
        setBudgets([data]); // single object fallback
      } else {
        setBudgets([]);
      }
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
    }
  };

  const fetchBudgetById = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/budget/${id}`);
      const data = await response.json();
      console.log("Fetched budget data:", data);
      setSelectedBudget(data);
    } catch (err) {
      console.error("Failed to fetch budget data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Create new budget
  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetName.trim()) return;

    try {
      const response = await fetch("http://localhost:5001/api/saveBudget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBudgetName }),
      });

      if (!response.ok) throw new Error("Failed to create budget");
      const created = await response.json();

      setNewBudgetName("");
      await fetchBudgets();
      setSelectedBudgetId(created._id);
      await fetchBudgetById(created._id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Load selected budget when changed
  useEffect(() => {
    if (selectedBudgetId) {
      fetchBudgetById(selectedBudgetId);
    }
  }, [selectedBudgetId]);

  return (
    <div className="App">
      <header>My Money Manager</header>
      {/* Select existing budget */}
      <FormControl fullWidth style={{ marginBottom: "1rem" }}>
        <InputLabel>Select Budget</InputLabel>
        <Select
          value={selectedBudgetId}
          label="Select Budget"
          onChange={(e) => setSelectedBudgetId(e.target.value)}
        >
          {budgets.map((b) => (
            <MenuItem key={b._id} value={b._id}>
              {b.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Create new budget */}
      <form onSubmit={handleCreateBudget} style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <TextField
          label="New Budget Name"
          value={newBudgetName}
          onChange={(e) => setNewBudgetName(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Create Budget
        </Button>
      </form>

      {/* Budget content */}
      {loading ? (
        <div>Loading...</div>
      ) : selectedBudget ? (
        <BudgetType
          budgetId={selectedBudgetId}
          incomeStreams={selectedBudget.incomeStreams}
          expenses={selectedBudget.expenses}
          onRefresh={() => fetchBudgetById(selectedBudgetId)}
        />
      ) : (
        <div>Select or create a budget to begin.</div>
      )}
    </div>
      // {budgets ? (
      //   <BudgetType budgetId={budgetId} incomeStreams={budgets.incomeStreams} expenses={budgets.expenses} onRefresh={fetchBudgets} />
      // ): (
      //   <div>{loading ? "Loading..." : "Failed to load budget data."}</div>
      // )}
  );
}

export default App;
