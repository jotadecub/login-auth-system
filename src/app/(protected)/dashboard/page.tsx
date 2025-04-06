// app/(protected)/dashboard/page.tsx
import { getSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getSession()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido, {session?.name || session?.email}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Has iniciado sesión correctamente. Tu rol actual es:{" "}
              <span className="font-semibold">{session?.role}</span>
            </p>
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline">
                <Link href="/profile">Ver perfil</Link>
              </Button>

              {(session?.role === "ADMIN" || session?.role === "SUPER_ADMIN") && (
                <Button asChild>
                  <Link href="/dashboard/users">Gestionar Usuarios</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {(session?.role === "ADMIN" || session?.role === "SUPER_ADMIN") && (
          <Card>
            <CardHeader>
              <CardTitle>Administración</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Gestiona usuarios y permisos del sistema.</p>
              <div className="flex flex-col space-y-2">
                <Button asChild variant="outline">
                  <Link href="/dashboard/users">Usuarios</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/permissions">Permisos</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}