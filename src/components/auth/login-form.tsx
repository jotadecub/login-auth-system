"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { z } from "zod";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Github } from "lucide-react";
import { login } from "@/app/actions/auth";
import { div, p } from "framer-motion/client";

const loginSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = loginSchema.safeParse({ email, password});

            if (!result.success) {
                const formattedErrors: Record<string, string> = {};
                result.error.errors.forEach((error) => {
                    if (error.path[0]) {
                        formattedErrors[error.path[0].toString()] = error.message;
                    }
                });
                setErrors(formattedErrors);
                setLoading(false);
                return;
            }

            const loginResult = await login(formData);

            if (loginResult.success) {
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(loginResult.error || "Error desconocido");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    const inputVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number ) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1 + 0.3,
                duration: 0.4,
            },
        }),
    };

    return (
        <div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <div>
                            Iniciar sesion
                        </div>
                    </CardHeader>

                    {error && (
                        <div>
                            {error}
                        </div>
                    )}

                    <CardContent>
                        <div>
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input 
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Correo electronico"
                                autoComplete="email"
                                required
                                className={errors.emial ? "border-red-500" : ""}
                            />
                            {errors.email && (
                                <p>{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password">Contraseña</Label>
                            <a href="/forgot-password">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <div>
                            <Input 
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && (
                                <p>{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Iniciando sesion" : "Iniciar sesión"}
                            </Button>
                        </div>

                        <div>
                            <div>
                                <Separator />
                            </div>
                            <div>
                                <span>
                                    O continua con
                                </span>
                            </div>
                        </div>

                        <div>
                            <Button type="button" disabled={loading}>
                                <Github />
                                Github
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div>
                            <span>¿No tienes una cuenta?{" "}</span>
                            <Link href="/register">
                                Registrate
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
