import type { NewRide, RideFilters } from "@/features/rides/types/ride";
import { getToken } from "@/features/auth/services/auth.service";

const API_URL = import.meta.env.VITE_API_URL;

export const createRide = async (newRide: NewRide) => {
  try {
    const response = await fetch(`${API_URL}/rides`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(newRide),
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

export const getAllRides = async (filters?: RideFilters) => {
  try {
    const query = new URLSearchParams();
    if (filters?.platform) query.append("platform", filters.platform);
    if (filters?.from) query.append("from", filters.from);
    if (filters?.to) query.append("to", filters.to);

    const response = await fetch(`${API_URL}/rides?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
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

export const getRideById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/rides/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
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

export const deleteRide = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/rides/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
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

export const updateRide = async (id: string, ride: Partial<NewRide>) => {
  try {
    const response = await fetch(`${API_URL}/rides/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(ride),
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
