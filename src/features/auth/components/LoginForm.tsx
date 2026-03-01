import { Link, useNavigate } from "react-router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Button } from "@/shared/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/components/ui/input-group";
import { LockIcon, MailIcon } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useEffect } from "react";

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const loading = useAuthStore((state) => state.loading);
  // const loginWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  const clearError = useAuthStore((state) => state.clearError);
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  // const [loadingGoogleAuth, setLoadingGoogleAuth] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const result = await login(data);
    if (result.success) {
      navigate("/app");
    }
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center text-pretty">
        <CardTitle className="text-2xl font-bold">Inicia sesión</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico y contraseña para iniciar sesión
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FieldGroup className="gap-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="signup-form-email">Email</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="email"
                        autoComplete="off"
                        placeholder="Ingresa tu email"
                      />
                      <InputGroupAddon>
                        <MailIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="password"
                        placeholder="Ingresa tu contraseña"
                      />
                      <InputGroupAddon>
                        <LockIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            {error && <div className="text-destructive">{error}</div>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button
          type="submit"
          form="signin-form"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? "Cargando" : "Iniciar Sesión"}
        </Button>
        {/* <Button
          variant="outline"
          className="w-full cursor-pointer"
          disabled={loadingGoogleAuth}
          onClick={() => {
            setLoadingGoogleAuth(true);
            loginWithGoogle();
          }}
        >
          {loadingGoogleAuth ? "Redirigiendo..." : "Continúa con Google"}
        </Button> */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <p>¿No tienes una cuenta?</p>
          <Link to={"/signup"}>
            <span className="text-primary">Regístrate</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
