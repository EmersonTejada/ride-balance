import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { rideSchema } from "@/schemas/ride.schema";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupInput } from "../ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useRideStore } from "@/stores/useRideStore";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface CreateRideFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateRideForm = ({ open, onOpenChange }: CreateRideFormProps) => {
  const addRide = useRideStore((state) => state.addRide);
  const loading = useRideStore((state) => state.loading);
  const error = useRideStore((state) => state.error);
  const clearError = useRideStore((state) => state.clearError);

  const form = useForm<z.infer<typeof rideSchema>>({
    resolver: zodResolver(rideSchema),
    defaultValues: {
      amount: 0,
      platform: "yummy",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: z.infer<typeof rideSchema>) => {
    const result = await addRide(data);
    if (result.success) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e: Event) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Crear Viaje</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="amount">Monto</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="Ingresa el monto"
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="platform"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="platform">Plataforma</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yummy">Yummy</SelectItem>
                      <SelectItem value="ridery">Ridery</SelectItem>
                      <SelectItem value="particular">Particular</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          {error && <div className="text-destructive">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};