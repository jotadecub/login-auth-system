"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { resetUserPassword } from "@/app/actions/auth"

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type ResetPasswordFormProps = {
  token: string
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = resetPasswordSchema.safeParse({ password, confirmPassword })

      if (!result.success) {
        const formattedErrors = result.error.format()
        setError(
          formattedErrors.password?._errors[0] ||
            formattedErrors.confirmPassword?._errors[0] ||
            "Por favor, verifica los datos ingresados",
        )
        setLoading(false)
        return
      }

      const response = await resetUserPassword(token, password)

      if (response.success) {
        setSuccess(true)
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(response.error || "Error al restablecer la contraseña")
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)
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
              Restablecer Contraseña
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

          {success ? (
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
              >
                <p>¡Tu contraseña ha sido restablecida correctamente!</p>
                <p className="mt-2">Serás redirigido a la página de inicio de sesión en unos segundos...</p>
              </motion.div>
            </CardContent>
          ) : (
            <CardContent className="space-y-4">
              <motion.div
                className="text-center text-muted-foreground mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Introduce tu nueva contraseña.
              </motion.div>

              <motion.div className="space-y-2" custom={0} initial="hidden" animate="visible" variants={inputVariants}>
                <Label htmlFor="password">Nueva contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </motion.div>

              <motion.div className="space-y-2" custom={1} initial="hidden" animate="visible" variants={inputVariants}>
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </motion.div>

              <motion.div custom={2} initial="hidden" animate="visible" variants={inputVariants}>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Restableciendo..." : "Restablecer contraseña"}
                </Button>
              </motion.div>
            </CardContent>
          )}

          <CardFooter>
            <motion.p
              className="w-full text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/login" className="text-primary hover:underline">
                Volver a iniciar sesión
              </Link>
            </motion.p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}