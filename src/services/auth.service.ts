import type { NewUser } from "@/types/user";

const API_URL = import.meta.env.VITE_API_URL

export const signUp = async (user: NewUser) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.error(err)
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
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message}`)
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err
  }
};

export const signOut = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include"
    });

    const data = await response.json()

    if (!response.ok) {
      console.log(response);
      throw new Error(`${data.message}`)
    }

    return data;
  } catch(err) {
    console.error(err)
    throw err
  }
};

export const getUser = async () => {
  try {
    
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message}`);
    }

    return data;
  } catch (err) {
    console.error(err)
    throw err;
  }
};


