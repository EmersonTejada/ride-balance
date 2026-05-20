import { useEffect, useState } from "react";
import { useReservationStore } from "@/features/reservations/stores/useReservationStore";
import { ReservationList } from "@/features/reservations/components/ReservationList";
import { CreateReservationDialog } from "@/features/reservations/components/CreateReservationDialog";
import { Button } from "@/shared/components/ui/button";
import { PlusIcon } from "lucide-react";

export const Reservations = () => {
  const fetchReservations = useReservationStore((state) => state.fetchReservations);
  const error = useReservationStore((state) => state.error);

  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchReservations(1);
  }, [fetchReservations]);

  const handlePageChange = (page: number) => {
    fetchReservations(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
        <Button size="lg" onClick={() => setCreateOpen(true)} className="sm:flex w-full sm:w-auto">
          <PlusIcon className="mr-2" />
          Nueva Reserva
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      <ReservationList onPageChange={handlePageChange} />

      <CreateReservationDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
};