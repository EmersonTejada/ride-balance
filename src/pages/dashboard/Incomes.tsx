import { useRideStore } from "@/stores/useRideStore";
import { useEffect, useState } from "react";
import { CreateRideForm } from "@/components/dashboard/CreateRideForm";
import { EditRideForm } from "@/components/dashboard/EditRideForm";
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
import type { Ride, RideFilters } from "@/types/ride";
import { EditIcon, TrashIcon, PlusIcon } from "lucide-react";

export const Incomes = () => {
  const rides = useRideStore((state) => state.rides);
  const fetchRides = useRideStore((state) => state.fetchRides);
  const deleteRide = useRideStore((state) => state.deleteRide);
  const loading = useRideStore((state) => state.loading);
  const error = useRideStore((state) => state.error);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRide, setEditingRide] = useState<Ride | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rideToDelete, setRideToDelete] = useState<Ride | null>(null);
  const [filterType, setFilterType] = useState<
    "all" | "week" | "month" | "range"
  >("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const getFilters = (): RideFilters | undefined => {
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
    fetchRides(getFilters());
  }, [fetchRides, filterType, fromDate, toDate]);

  const handleEdit = (ride: Ride) => {
    setEditingRide(ride);
    setEditOpen(true);
  };

  const handleDelete = (ride: Ride) => {
    setRideToDelete(ride);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (rideToDelete) {
      await deleteRide(rideToDelete.id);
      setDeleteOpen(false);
      setRideToDelete(null);
    }
  };

  return (
    <div className="p-2 md:p-4 space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Ingresos</h1>
        <Button
          size="lg"
          onClick={() => setCreateOpen(true)}
          className=" sm:flex w-full sm:w-auto"
        >
          <PlusIcon className="mr-2" />
          Crear Viaje
        </Button>
      </div>

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
          <TableHeader >
            <TableRow>
              <TableHead className="text-center">Fecha</TableHead>
              <TableHead className="text-center">Plataforma</TableHead>
              <TableHead className="text-center">Monto</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : rides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No hay viajes
                </TableCell>
              </TableRow>
            ) : (
              rides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell className="text-center">
                    {new Date(ride.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center capitalize">{ride.platform}</TableCell>
                  <TableCell className="text-center">${ride.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(ride)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(ride)}
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
          <p className="text-center">Cargando...</p>
        ) : rides.length === 0 ? (
          <p className="text-center">No hay viajes</p>
        ) : (
          rides.map((ride) => (
            <Card key={ride.id} className="p-4 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="capitalize font-medium">{ride.platform}</span>
                <span className="text-lg font-bold">
                  ${ride.amount.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {new Date(ride.date).toLocaleDateString()}
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(ride)}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ride)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <CreateRideForm open={createOpen} onOpenChange={setCreateOpen} />
      {editingRide && (
        <EditRideForm
          ride={editingRide}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que quieres eliminar este viaje?</p>
          {rideToDelete && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(rideToDelete.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Plataforma:</strong> {rideToDelete.platform}
              </p>
              <p>
                <strong>Monto:</strong> ${rideToDelete.amount.toFixed(2)}
              </p>
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

      {/* Floating Create Button for Mobile */}
      {/* <Button
        size="lg"
        onClick={() => setCreateOpen(true)}
        className="sm:hidden absolute bottom-4 right-4 rounded-full w-14 h-14 p-0 shadow-lg"
      >
        <PlusIcon className="h-6 w-6" />
      </Button> */}
    </div>
  );
};
