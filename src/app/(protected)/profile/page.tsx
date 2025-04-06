import { getSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TwoFactorSetup from "@/components/auth/two-factor-setup"
import prisma from "@/lib/prisma"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    return null
  }

  // Obtein user data from the session
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      twoFactorEnabled: true,
      createdAt: true,
    },
  })

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <TwoFactorSetup userId={user.id} twoFactorEnabled={user.twoFactorEnabled} />
    </div>
  )
}