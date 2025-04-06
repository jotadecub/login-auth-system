"use client"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { setupTwoFactor, activateTwoFactor, deactivateTwoFactor } from "@/app/actions/auth"
import { toast, useSonner } from "sonner"
import { Switch } from "@/components/ui/switch"

const twoFactorCodeSchema = z.object({
  code: z.string().length(6, "El código debe tener 6 dígitos"),
})

type TwoFactorSetupProps = {
  userId: string
  twoFactorEnabled: boolean
}

export default function TwoFactorSetup({ userId, twoFactorEnabled }: TwoFactorSetupProps) {
  const [loading, setLoading] = useState(false)
  const [setupMode, setSetupMode] = useState(false)
  const [secret, setSecret] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSetup = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await setupTwoFactor(userId)

      if (result.success && result.secret && result.qrCodeUrl) {
        setSecret(result.secret)
        setQrCodeUrl(result.qrCodeUrl)
        setSetupMode(true)
      } else {
        setError(result.error || "Error al configurar la autenticación de dos factores")
      }
    } catch (error) {
      console.error("Error al configurar 2FA:", error)
      setError("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = twoFactorCodeSchema.safeParse({ code: verificationCode })

      if (!result.success) {
        setError(result.error.errors[0].message)
        setLoading(false)
        return
      }

      const activationResult = await activateTwoFactor(userId, secret, verificationCode)

      if (activationResult.success) {
        toast({
          title: "Autenticación de dos factores activada",
          description: "Tu cuenta ahora está protegida con autenticación de dos factores.",
        })
        // Recargar la página para actualizar el estado
        window.location.reload()
      } else {
        setError(activationResult.error || "Error al verificar el código")
      }
    } catch (error) {
      console.error("Error al activar 2FA:", error)
      setError("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      // Si está activando, mostrar el flujo de configuración
      handleSetup()
    } else {
      // Si está desactivando
      setLoading(true)
      try {
        const result = await deactivateTwoFactor(userId)

        if (result.success) {
          toast({
            title: "Autenticación de dos factores desactivada",
            description: "La autenticación de dos factores ha sido desactivada para tu cuenta.",
          })
          // Recargar la página para actualizar el estado
          window.location.reload()
        } else {
          toast({
            title: "Error",
            description: result.error || "No se pudo desactivar la autenticación de dos factores",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error al desactivar 2FA:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al desactivar la autenticación de dos factores",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Autenticación de Dos Factores</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {setupMode ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="mb-4">
                Escanea el código QR con tu aplicación de autenticación (como Google Authenticator, Authy o Microsoft
                Authenticator).
              </p>

              <div className="flex justify-center mb-4">
                {qrCodeUrl && (
                  <div className="border p-4 rounded-lg bg-white">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                      alt="Código QR para autenticación de dos factores"
                      width={200}
                      height={200}
                    />
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Si no puedes escanear el código QR, puedes ingresar esta clave manualmente en tu aplicación:
              </p>

              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm mb-6 break-all">{secret}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationCode">Código de verificación</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="123456"
                maxLength={6}
                className="text-center text-xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                Ingresa el código de 6 dígitos que aparece en tu aplicación de autenticación.
              </p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setSetupMode(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleVerify} disabled={loading || verificationCode.length !== 6}>
                {loading ? "Verificando..." : "Verificar y activar"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Estado</p>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled
                    ? "La autenticación de dos factores está activada"
                    : "La autenticación de dos factores está desactivada"}
                </p>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle} disabled={loading} />
            </div>

            <div>
              <p className="text-sm">
                La autenticación de dos factores agrega una capa adicional de seguridad a tu cuenta al requerir un
                código de verificación además de tu contraseña.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}