import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recuperar Contraseña",
  description: "Solicita un enlace para restablecer tu contraseña",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Recuperar Contraseña</h1>
          <p className="text-muted-foreground mt-2">Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}