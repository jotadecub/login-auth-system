"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { requestPasswordReset } from "@/app/actions/auth"

const forgotPasswordSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
})

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = forgotPasswordSchema.safeParse({ email })

      if (!result.success) {
        setError("Por favor, introduce un correo electrónico válido")
        setLoading(false)
        return
      }

      const response = await requestPasswordReset(email)

      if (response.success) {
        setSuccess(true)
      } else {
        setError(response.error || "Error al procesar la solicitud")
      }
    } catch (error) {
      console.error("Error al solicitar restablecimiento:", error)
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
              Recuperar Contraseña
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
                <p>
                  Se ha enviado un correo electrónico a <strong>{email}</strong> con instrucciones para restablecer tu
                  contraseña.
                </p>
                <p className="mt-2">Por favor, revisa tu bandeja de entrada y sigue las instrucciones.</p>
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
                Introduce tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </motion.div>

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
                />
              </motion.div>

              <motion.div custom={1} initial="hidden" animate="visible" variants={inputVariants}>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar instrucciones"}
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