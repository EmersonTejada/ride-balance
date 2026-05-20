import type { NewReservation, PaginatedResponse, Reservation } from "@/features/reservations/types/reservation";
import { getToken } from "@/features/auth/services/auth.service";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllReservations = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Reservation>> => {
  try {
    const query = new URLSearchParams();
    query.append("page", page.toString());
    query.append("limit", limit.toString());

    const response = await fetch(`${API_URL}/reservations?${query.toString()}`, {
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

export const getReservationById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // NestJS returns flat reservation - wrap for store compatibility
    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createReservation = async (newReservation: NewReservation) => {
  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(newReservation),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const confirmReservation = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/reservations/${id}/confirm`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const cancelReservation = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/reservations/${id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteReservation = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};