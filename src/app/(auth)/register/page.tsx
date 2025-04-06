import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Crear Cuenta</h1>
          <p className="text-muted-foreground mt-2">Regístrate para acceder a todas las funcionalidades</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}