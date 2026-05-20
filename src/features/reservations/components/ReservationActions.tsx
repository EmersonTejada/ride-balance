import { useState } from "react";
import { useReservationStore } from "@/features/reservations/stores/useReservationStore";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { CheckIcon, XIcon, TrashIcon } from "lucide-react";
import type { Reservation } from "@/features/reservations/types/reservation";

interface ReservationActionsProps {
  reservation: Reservation;
}

export const ReservationActions = ({ reservation }: ReservationActionsProps) => {
  const confirmReservation = useReservationStore((state) => state.confirmReservation);
  const cancelReservation = useReservationStore((state) => state.cancelReservation);
  const deleteReservation = useReservationStore((state) => state.deleteReservation);
  const loading = useReservationStore((state) => state.loading);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isCreated = reservation.status === "CREATED";

  const handleConfirm = async () => {
    setActionLoading("confirm");
    await confirmReservation(reservation.id);
    setActionLoading(null);
  };

  const handleCancel = async () => {
    setActionLoading("cancel");
    await cancelReservation(reservation.id);
    setActionLoading(null);
  };

  const handleDelete = async () => {
    setActionLoading("delete");
    await deleteReservation(reservation.id);
    setActionLoading(null);
    setDeleteOpen(false);
  };

  return (
    <>
      <div className="flex justify-center gap-2">
        {isCreated && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfirm}
              disabled={loading && actionLoading === "confirm"}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              {actionLoading === "confirm" ? "Confirmando..." : "Confirmar"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={loading && actionLoading === "cancel"}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <XIcon className="h-4 w-4 mr-1" />
              {actionLoading === "cancel" ? "Cancelando..." : "Cancelar"}
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          disabled={loading && actionLoading === "delete"}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminacion</DialogTitle>
            <DialogDescription>
              Estas seguro de que quieres eliminar esta reserva?
            </DialogDescription>
          </DialogHeader>
          {reservation && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p>
                <strong>Cliente:</strong> {reservation.clientName}
              </p>
              <p>
                <strong>Fecha:</strong> {reservation.date}
              </p>
              {reservation.from && reservation.to && (
                <p>
                  <strong>Ruta:</strong> {reservation.from} - {reservation.to}
                </p>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading === "delete"}>
              {actionLoading === "delete" ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};