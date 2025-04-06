import type React from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify if the user is authenticated
  const session = await getSession()

  // If the user is not authenticated, redirect to the login page
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={session} />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
      <Footer />
    </div>
  )
}