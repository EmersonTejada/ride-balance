import { useExpenseStore } from "@/stores/useExpenseStore";
import { useEffect, useState } from "react";
import { CreateExpenseForm } from "@/components/dashboard/CreateExpenseForm";
import { EditExpenseForm } from "@/components/dashboard/EditExpenseForm";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Expense, ExpenseFilters } from "@/schemas/expense.schema";
import { EditIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

const categoryLabels: Record<string, string> = {
  fuel: "Combustible",
  maintenance: "Mantenimiento",
  food: "Comida",
  insurance: "Seguro",
  parking: "Estacionamiento",
  phone: "Teléfono",
  tolls: "Peajes",
  other: "Otro",
};

const subcategoryLabels: Record<string, string> = {
  fuel_refill: "Recarga de combustible",
  oil_change: "Cambio de aceite",
  oil_refill: "Recarga de aceite",
  repair: "Reparación",
  spare_part: "Repuesto",
  tire: "Llanta",
  brake: "Freno",
  battery: "Batería",
  cleaning: "Limpieza",
  accessory: "Accesorio",
  unknown: "Desconocido",
};

export const Expenses = () => {
  const expenses = useExpenseStore((state) => state.expenses);
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const loading = useExpenseStore((state) => state.loading);
  const error = useExpenseStore((state) => state.error);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [filterType, setFilterType] = useState<
    "all" | "week" | "month" | "range"
  >("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getFilters = (): ExpenseFilters | undefined => {
    if (filterType === "all") return undefined;
    if (filterType === "range") {
      return { from: fromDate, to: toDate };
    }
    const now = new Date();
    let from: string;
    let to: string;
    if (filterType === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      from = startOfWeek.toISOString().split("T")[0];
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
      to = endOfWeek.toISOString().split("T")[0];
    } else {
      // month
      from = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      to = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        .toISOString()
        .split("T")[0];
    }
    return { from, to };
  };

  useEffect(() => {
    fetchExpenses(getFilters());
  }, [fetchExpenses, filterType, fromDate, toDate]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setEditOpen(true);
  };

  const handleDelete = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete.id);
      setDeleteOpen(false);
      setExpenseToDelete(null);
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <div className="p-2 md:p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Gastos</h1>
        <Button
          size="lg"
          onClick={() => setCreateOpen(true)}
          className="sm:flex w-full sm:w-auto"
        >
          <PlusIcon className="mr-2" />
          Registrar Gasto
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total de Gastos</span>
          <span className="text-2xl font-bold">
            ${totalExpenses.toFixed(2)}
          </span>
        </div>
      </Card>

      <div className="space-y-4">
        <Tabs
          value={filterType}
          onValueChange={(value: string) =>
            setFilterType(value as "all" | "week" | "month" | "range")
          }
        >
          <TabsList className="grid w-full grid-cols-2 mb-5 gap-2 md:grid-cols-4 md:mb-0 ">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="week">Esta Semana</TabsTrigger>
            <TabsTrigger value="month">Este Mes</TabsTrigger>
            <TabsTrigger value="range">Rango</TabsTrigger>
          </TabsList>
          <TabsContent value="range" className="space-y-2 mt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="from">Desde</Label>
                <Input
                  id="from"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="to">Hasta</Label>
                <Input
                  id="to"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {error && <div className="text-destructive">{error}</div>}

      {/* Desktop Table */}
      <div className="hidden sm:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Fecha</TableHead>
              <TableHead className="text-center">Categoría</TableHead>
              <TableHead className="text-center">Subcategoría</TableHead>
              <TableHead className="text-center">Monto</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-center"><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-28 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-8 w-20 mx-auto" /></TableCell>
                  </TableRow>
                ))}
              </>
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No hay gastos registrados
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="text-center">
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center capitalize">
                    {categoryLabels[expense.category] || expense.category}
                  </TableCell>
                  <TableCell className="text-center capitalize">
                    {expense.subcategory
                      ? subcategoryLabels[expense.subcategory] ||
                        expense.subcategory
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    ${expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(expense)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
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
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Spinner className="h-6 w-6" />
            <p className="text-sm text-muted-foreground">Cargando gastos...</p>
          </div>
        ) : expenses.length === 0 ? (
          <p className="text-center">No hay gastos registrados</p>
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id} className="p-4 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="capitalize font-medium">
                  {categoryLabels[expense.category] || expense.category}
                </span>
                <span className="text-lg font-bold">
                  ${expense.amount.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                  {expense.subcategory && (
                    <p className="text-sm text-muted-foreground capitalize">
                      {subcategoryLabels[expense.subcategory] ||
                        expense.subcategory}
                    </p>
                  )}
                  {expense.description && (
                    <p className="text-sm text-muted-foreground">
                      {expense.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(expense)}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(expense)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <CreateExpenseForm open={createOpen} onOpenChange={setCreateOpen} />
      {editingExpense && (
        <EditExpenseForm
          expense={editingExpense}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que quieres eliminar este gasto?</p>
          {expenseToDelete && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(expenseToDelete.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Categoría:</strong>{" "}
                {categoryLabels[expenseToDelete.category] ||
                  expenseToDelete.category}
              </p>
              <p>
                <strong>Monto:</strong> ${expenseToDelete.amount.toFixed(2)}
              </p>
              {expenseToDelete.description && (
                <p>
                  <strong>Descripción:</strong> {expenseToDelete.description}
                </p>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
