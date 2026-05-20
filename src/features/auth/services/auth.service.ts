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

    // NestJS returns { access_token: "jwt..." }
    if (data.access_token) {
      setToken(data.access_token);
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

    // NestJS returns { access_token: "jwt..." }
    if (data.access_token) {
      setToken(data.access_token);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const signOut = async () => {
  // NestJS has no /auth/logout endpoint - just clear locally
  clearToken();
  return { success: true };
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

    // NestJS /auth/me returns flat { sub, email, name } - map sub -> userId and wrap
    return {
      data: {
        user: {
          userId: data.sub,
          email: data.email,
          name: data.name,
        },
      },
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
