import { getSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p>{session.name || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Correo electrónico</p>
              <p>{session.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rol</p>
              <p>{session.role}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}