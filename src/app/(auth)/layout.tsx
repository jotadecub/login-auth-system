import type React from "react"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify if the user is authenticated
  const session = await getSession()

  // If the user is authenticated, redirect to the dashboard
  if (session) {
    redirect("/dashboard")
  }

  return <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">{children}</div>
}