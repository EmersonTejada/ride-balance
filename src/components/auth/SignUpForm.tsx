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
} from "../ui/card";

import { Button } from "../ui/button";
import { useForm, Controller } from "react-hook-form";
import { signUpSchema } from "@/schemas/auth.schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { LockIcon, MailIcon } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export const SignUpForm = () => {
  const signUp = useAuthStore((state) => state.signUp);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const result = await signUp(data);
    if (result.success) {
      navigate("/app");
    } else {
      console.error("Error:", error);
    }
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center text-pretty">
        <CardTitle className="text-2xl font-bold">Crea tu cuenta</CardTitle>
        <CardDescription>
          Ingresa un correo electrónico y contraseña para registrarte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FieldGroup className="gap-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
                        placeholder="Ingresa una contraseña"
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
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>
                      Confirma tu contraseña
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="password"
                        placeholder="Confirma tu contraseña"
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
            {error && <p className="text-destructive">{error}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button
          type="submit"
          form="signup-form"
          disabled={loading}
          className="w-full cursor-pointer"
        >
          {!loading ? "Registrate" : "Cargando"}
        </Button>
        <Button variant="outline" className="w-full cursor-pointer">
          Registrate con Google
        </Button>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <p>¿Ya tienes una cuenta?</p>
          <Link to={"/login"}>
            <span className="text-primary">Ingresa</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
