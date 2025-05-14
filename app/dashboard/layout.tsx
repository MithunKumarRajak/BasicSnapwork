import type React from "react"
import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardNav from "@/components/DashboardNav"

export const metadata: Metadata = {
  title: "Dashboard - SnapWork",
  description: "Manage your SnapWork account",
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <DashboardNav />
        </div>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  )
}
