import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, type ReservationFormData } from "@/features/reservations/schemas/reservation.schema";
import { useReservationStore } from "@/features/reservations/stores/useReservationStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

interface CreateReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateReservationDialog = ({ open, onOpenChange }: CreateReservationDialogProps) => {
  const createReservation = useReservationStore((state) => state.createReservation);
  const loading = useReservationStore((state) => state.loading);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
  });

  const onSubmit = async (data: ReservationFormData) => {
    const result = await createReservation(data);
    if (result.success) {
      reset();
      onOpenChange(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Reserva</DialogTitle>
          <DialogDescription>
            Completa los datos para crear una nueva reserva
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nombre del Cliente *</Label>
              <Input
                id="clientName"
                placeholder="Juan Perez"
                {...register("clientName")}
              />
              {errors.clientName && (
                <p className="text-sm text-destructive">{errors.clientName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                placeholder="+54 11 1234 5678"
                {...register("phone")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">Desde</Label>
                <Input
                  id="from"
                  placeholder="Aeroparque"
                  {...register("from")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">Hasta</Label>
                <Input
                  id="to"
                  placeholder="Palermo"
                  {...register("to")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                placeholder="Observaciones adicionales..."
                {...register("notes")}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Reserva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};