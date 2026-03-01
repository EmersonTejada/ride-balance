import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { expenseSchema } from "@/features/expenses/schemas/expense.schema";
import { Button } from '@/shared/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { InputGroup, InputGroupInput } from '@/shared/components/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { useExpenseStore } from "@/features/expenses/stores/useExpenseStore";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import type { Expense } from "@/features/expenses/schemas/expense.schema";

interface EditExpenseFormProps {
  expense: Expense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditExpenseForm = ({ expense, open, onOpenChange }: EditExpenseFormProps) => {
  const updateExpense = useExpenseStore((state) => state.updateExpense);
  const loading = useExpenseStore((state) => state.loading);
  const error = useExpenseStore((state) => state.error);
  const clearError = useExpenseStore((state) => state.clearError);

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: expense.amount,
      category: expense.category,
      subcategory: expense.subcategory,
      description: expense.description,
      date: new Date(expense.date).toISOString().split("T")[0],
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: z.infer<typeof expenseSchema>) => {
    const result = await updateExpense(expense.id, data);
    if (result.success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e: Event) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Editar Gasto</DialogTitle>
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
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="date">Fecha</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="date"
                      type="date"
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="category">Categoría</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fuel">Combustible</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      <SelectItem value="food">Comida</SelectItem>
                      <SelectItem value="insurance">Seguro</SelectItem>
                      <SelectItem value="parking">Estacionamiento</SelectItem>
                      <SelectItem value="phone">Teléfono</SelectItem>
                      <SelectItem value="tolls">Peajes</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="subcategory"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="subcategory">Subcategoría (opcional)</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la subcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fuel_refill">Recarga de combustible</SelectItem>
                      <SelectItem value="oil_change">Cambio de aceite</SelectItem>
                      <SelectItem value="oil_refill">Recarga de aceite</SelectItem>
                      <SelectItem value="repair">Reparación</SelectItem>
                      <SelectItem value="spare_part">Repuesto</SelectItem>
                      <SelectItem value="tire">Llanta</SelectItem>
                      <SelectItem value="brake">Freno</SelectItem>
                      <SelectItem value="battery">Batería</SelectItem>
                      <SelectItem value="cleaning">Limpieza</SelectItem>
                      <SelectItem value="accessory">Accesorio</SelectItem>
                      <SelectItem value="unknown">Desconocido</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="description">Descripción (opcional)</FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Ingresa una descripción"
                    value={field.value || ""}
                  />
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
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
