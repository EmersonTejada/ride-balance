import { getToken } from "@/features/auth/services/auth.service";

const API_URL = import.meta.env.VITE_API_URL;

export const getWeeklyDashboard = async () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(`${API_URL}/dashboard/weekly`, {
      method: "GET",
      headers: {
        "X-Timezone": timezone,
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
