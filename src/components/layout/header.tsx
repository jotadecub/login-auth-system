"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"
import type { Role } from "@prisma/client"

type HeaderProps = {
  user: {
    name?: string
    email: string
    role: Role
  }
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
    router.refresh() // Refresh the page to update the state
  }

  // Function to get the role name based on the Role enum
  const getRoleName = (role: Role) => {
    const roleNames = {
      USER: "Usuario",
      EDITOR: "Editor",
      ADMIN: "Administrador",
      SUPER_ADMIN: "Super Administrador",
    }

    return roleNames[role] || role
  }

  return (
    <header className="bg-white dark:bg-gray-950 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          Mi Aplicación
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground mr-2">{user.name || user.email}</span>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{getRoleName(user.role)}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}