import ResetPasswordForm from "@/components/auth/reset-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Restablecer Contraseña",
  description: "Crea una nueva contraseña para tu cuenta",
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600">Enlace Inválido</h1>
            <p className="text-muted-foreground mt-2">
              El enlace para restablecer la contraseña es inválido o ha expirado.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Restablecer Contraseña</h1>
          <p className="text-muted-foreground mt-2">Crea una nueva contraseña para tu cuenta</p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}