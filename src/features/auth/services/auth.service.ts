import type { NewUser } from "@/features/auth/types/user";

const API_URL = import.meta.env.VITE_API_URL;

export const getToken = () => localStorage.getItem("token");

export const setToken = (token: string) => localStorage.setItem("token", token);

export const clearToken = () => localStorage.removeItem("token");

export const signUp = async (user: NewUser) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    if (data.token) {
      setToken(data.token);
    } else if (data.data?.token) {
      setToken(data.data.token);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message}`);
    }

    if (data.token) {
      setToken(data.token);
    } else if (data.data?.token) {
      setToken(data.data.token);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const signOut = async () => {
  try {
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(response);
      throw new Error(`${data.message}`);
    }

    clearToken();
    return data;
  } catch (err) {
    console.error(err);
    clearToken();
    throw err;
  }
};

export const getUser = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message}`);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
