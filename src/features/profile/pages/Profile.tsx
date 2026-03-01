import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { User, Mail, LogOut, Calendar } from "lucide-react";
import { useNavigate } from "react-router";

export const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const displayName = user?.name || user?.email || "User";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-col items-center pb-2">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage alt={displayName} />
              <AvatarFallback className="text-2xl">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{displayName}</h2>
            <Badge variant="secondary" className="mt-2">
              Usuario Verificado
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{user?.email || "No disponible"}</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {user?.name || "Nombre no disponible"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Miembro desde 2025</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <h3 className="text-lg font-semibold">Cuenta</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gestiona la configuración de tu cuenta y preferencias.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button variant="outline" disabled>
                Editar Perfil
              </Button>
              <Button variant="outline" disabled>
                Cambiar Contraseña
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
