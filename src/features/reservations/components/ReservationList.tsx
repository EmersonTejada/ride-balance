import { useReservationStore } from "@/features/reservations/stores/useReservationStore";
import { ReservationActions } from "./ReservationActions";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Reservation } from "@/features/reservations/types/reservation";

interface ReservationListProps {
  onPageChange: (page: number) => void;
}

const getStatusBadge = (status: Reservation["status"]) => {
  switch (status) {
    case "CREATED":
      return <Badge variant="secondary">Creada</Badge>;
    case "CONFIRMED":
      return <Badge className="bg-green-500 hover:bg-green-600">Confirmada</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Cancelada</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const ReservationList = ({ onPageChange }: ReservationListProps) => {
  const reservations = useReservationStore((state) => state.reservations);
  const loading = useReservationStore((state) => state.loading);
  const page = useReservationStore((state) => state.page);
  const totalPages = useReservationStore((state) => state.totalPages);

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden sm:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Cliente</TableHead>
              <TableHead className="text-center">Fecha</TableHead>
              <TableHead className="text-center">Ruta</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-32 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-40 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-6 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-8 w-32 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No hay reservas
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="text-center font-medium">
                    {reservation.clientName}
                    {reservation.phone && (
                      <p className="text-xs text-muted-foreground">
                        {reservation.phone}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(reservation.date).toLocaleDateString("es-AR")}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {reservation.from && reservation.to
                      ? `${reservation.from} - ${reservation.to}`
                      : reservation.from || reservation.to || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(reservation.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    <ReservationActions reservation={reservation} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-20" />
              </Card>
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay reservas</p>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{reservation.clientName}</p>
                  {reservation.phone && (
                    <p className="text-xs text-muted-foreground">{reservation.phone}</p>
                  )}
                </div>
                {getStatusBadge(reservation.status)}
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{new Date(reservation.date).toLocaleDateString("es-AR")}</span>
                <span>
                  {reservation.from && reservation.to
                    ? `${reservation.from} - ${reservation.to}`
                    : reservation.from || reservation.to || "-"}
                </span>
              </div>
              <div className="pt-2 border-t">
                <ReservationActions reservation={reservation} />
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || loading}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Pagina {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || loading}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};