"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { login } from "@/app/actions/auth"
import { useRouter } from "next/navigation"

const twoFactorSchema = z.object({
  code: z.string().length(6, "El código debe tener 6 dígitos"),
})

type TwoFactorFormProps = {
  email: string
  password: string
  userId: string
}

export default function TwoFactorForm({ email, password, userId }: TwoFactorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = twoFactorSchema.safeParse({ code })

      if (!result.success) {
        setError(result.error.errors[0].message)
        setLoading(false)
        return
      }

      // Create a FormData object with the code
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("twoFactorCode", code)

      const loginResult = await login(formData)

      if (loginResult.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(loginResult.error || "Error al verificar el código")
      }
    } catch (error) {
      console.error("Error al verificar código 2FA:", error)
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
              Verificación de Dos Factores
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
            <motion.div
              className="text-center text-muted-foreground mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Introduce el código de verificación de tu aplicación de autenticación.
            </motion.div>

            <motion.div className="space-y-2" custom={0} initial="hidden" animate="visible" variants={inputVariants}>
              <Label htmlFor="code">Código de verificación</Label>
              <Input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="123456"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                className="text-center text-xl tracking-widest"
              />
            </motion.div>

            <motion.div custom={1} initial="hidden" animate="visible" variants={inputVariants}>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verificando..." : "Verificar"}
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
              Si no puedes acceder a tu aplicación de autenticación, contacta con soporte.
            </motion.p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}