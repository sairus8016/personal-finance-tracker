import React, { useEffect, useState } from 'react';
import BudgetType from './Budget';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Card, CardContent, Typography, Stack, Collapse, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
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
  const [expanded, setExpanded] = useState(!selectedBudgetId);
  const selectedBudgetName =
    budgets?.find((b) => b._id === selectedBudgetId)?.name || "No Budget Selected";

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
      <Card sx={{ maxWidth: 600, margin: "2rem auto", boxShadow: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              {expanded ? "Manage Budgets" : `Current Budget: ${selectedBudgetName}`}
            </Typography>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>

          <Collapse in={expanded}>
            <Stack spacing={2} mt={2}>
              <FormControl fullWidth>
                <InputLabel>Select Existing Budget</InputLabel>
                <Select
                  value={selectedBudgetId || ""}
                  label="Select Existing Budget"
                  onChange={(e) => setSelectedBudgetId(e.target.value)}
                >
                  {budgets?.map((b) => (
                    <MenuItem key={b._id} value={b._id}>
                      {b.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="body2" color="textSecondary">
                or create a new budget:
              </Typography>

              <Stack direction="row" spacing={1}>
                <TextField
                  label="New Budget Name"
                  size="small"
                  fullWidth
                  value={newBudgetName}
                  onChange={(e) => setNewBudgetName(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleCreateBudget}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Create
                </Button>
              </Stack>
            </Stack>
          </Collapse>
        </CardContent>
      </Card>

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
