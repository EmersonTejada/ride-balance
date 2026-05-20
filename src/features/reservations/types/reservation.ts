export type ReservationStatus = "CREATED" | "CONFIRMED" | "CANCELLED";

export interface Reservation {
  id: string;
  clientName: string;
  phone?: string;
  date: string;
  from?: string;
  to?: string;
  notes?: string;
  status: ReservationStatus;
  userId: string;
}

export interface NewReservation {
  clientName: string;
  phone?: string;
  date: string;
  from?: string;
  to?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}