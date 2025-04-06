// components/auth/login-form.tsx
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
import { Separator } from "@/components/ui/separator"
import { Github } from 'lucide-react'
import { login } from "@/app/actions/auth"

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setErrors({})

    try {
      const result = loginSchema.safeParse({ email, password })

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

      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const loginResult = await login(formData)

      if (loginResult.success) {
        router.push("/dashboard")
        router.refresh() // Refrescar para actualizar la sesión
      } else {
        setError(loginResult.error || "Error al iniciar sesión")
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error)
      setError("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.4,
      },
    }),
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-semibold text-center"
            >
              Iniciar Sesión
            </motion.div>
          </CardHeader>

          {error && (
            <motion.div
              className="mx-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.div>
          )}

          <CardContent className="space-y-4">
            <motion.div className="space-y-2" custom={0} initial="hidden" animate="visible" variants={inputVariants}>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ejemplo@correo.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </motion.div>

            <motion.div className="space-y-2" custom={1} initial="hidden" animate="visible" variants={inputVariants}>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </motion.div>

            <motion.div custom={2} initial="hidden" animate="visible" variants={inputVariants}>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </motion.div>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={inputVariants}
              className="relative my-4"
            >
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
              </div>
            </motion.div>

            <motion.div custom={4} initial="hidden" animate="visible" variants={inputVariants}>
              <Button variant="outline" type="button" className="w-full">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </motion.div>
          </CardContent>
          <CardFooter>
            <motion.p
              className="w-full text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Regístrate
              </Link>
            </motion.p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}