import type {
  NewExpense,
  ExpenseFilters,
} from "@/features/expenses/schemas/expense.schema";
import { getToken } from "@/features/auth/services/auth.service";
import {
  toBackendCategory,
  toBackendSubcategory,
} from "@/shared/utils/enum-utils";

const API_URL = import.meta.env.VITE_API_URL;

export const createExpense = async (newExpense: NewExpense) => {
  try {
    const payload = {
      ...newExpense,
      category: toBackendCategory(newExpense.category),
      ...(newExpense.subcategory && {
        subcategory: toBackendSubcategory(newExpense.subcategory),
      }),
    };

    const response = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // NestJS returns flat expense object - wrap for store compatibility
    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllExpenses = async (_filters?: ExpenseFilters) => {
  try {
    // NestJS uses pagination: ?page=1&limit=50
    const query = new URLSearchParams();
    query.append("page", "1");
    query.append("limit", "50");

    const response = await fetch(`${API_URL}/expenses?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // NestJS returns { data: [...], meta: {...} }
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
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // NestJS returns flat expense object - wrap for store compatibility
    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // NestJS returns flat response - wrap for store compatibility
    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateExpense = async (
  id: string,
  expense: Partial<NewExpense>,
) => {
  try {
    const payload = {
      ...expense,
      ...(expense.category && { category: toBackendCategory(expense.category) }),
      ...(expense.subcategory && {
        subcategory: toBackendSubcategory(expense.subcategory),
      }),
    };

    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // NestJS returns flat expense object - wrap for store compatibility
    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
