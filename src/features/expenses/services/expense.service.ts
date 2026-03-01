import type { NewExpense, ExpenseFilters } from "@/features/expenses/schemas/expense.schema";

const API_URL = import.meta.env.VITE_API_URL;

export const createExpense = async (newExpense: NewExpense) => {
  try {
    const response = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllExpenses = async (filters?: ExpenseFilters) => {
  try {
    const query = new URLSearchParams();
    if (filters?.category) query.append("category", filters.category);
    if (filters?.from) query.append("from", filters.from);
    if (filters?.to) query.append("to", filters.to);

    const response = await fetch(`${API_URL}/expenses?${query.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getExpenseById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateExpense = async (id: string, expense: Partial<NewExpense>) => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
