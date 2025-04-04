"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { register } from "@/app/actions/auth"

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export default function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = registerSchema.safeParse({ name, email, password })

      if (!result.success) {
        const formattedErrors: Record<string, string> = {}
        result.error.errors.forEach((error) => {
          if (error.path[0]) {
            formattedErrors[error.path[0].toString()] = error.message
          }
        })
        setErrors(formattedErrors)
        setLoading(false)
        return
      }

      const registerResult = await register(formData)

      if (registerResult.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(registerResult.error || "Error al registrarse")
      }
    } catch (error) {
      console.error("Error durante el registro:", error)
      setError("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <div>
                Crear una cuenta
            </div>
          </CardHeader>

          {error && (
            <div>
                {error}
            </div>
          )}

          <CardContent>
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                autoComplete="name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ejemplo@correo.com"
                autoComplete="email"
                required
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <Button type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p>
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login">
                Iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}