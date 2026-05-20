import type { NewRide, RideFilters } from "@/features/rides/types/ride";
import { getToken } from "@/features/auth/services/auth.service";
import { toBackendPlatform } from "@/shared/utils/enum-utils";

const API_URL = import.meta.env.VITE_API_URL;

export const createRide = async (newRide: NewRide) => {
  try {
    const payload = {
      ...newRide,
      platform: toBackendPlatform(newRide.platform),
    };

    const response = await fetch(`${API_URL}/rides`, {
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

    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllRides = async (_filters?: RideFilters) => {
  try {
    // NestJS uses pagination: ?page=1&limit=50
    const query = new URLSearchParams();
    query.append("page", "1");
    query.append("limit", "50");

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

    // NestJS returns { data: [...], meta: {...} }
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

    // NestJS returns flat ride object - wrap for store compatibility
    return { data };
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

    // NestJS returns flat response - wrap for store compatibility
    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateRide = async (id: string, ride: Partial<NewRide>) => {
  try {
    const payload = {
      ...ride,
      ...(ride.platform && { platform: toBackendPlatform(ride.platform) }),
    };

    const response = await fetch(`${API_URL}/rides/${id}`, {
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

    // NestJS returns flat ride object - wrap for store compatibility
    return { data };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
