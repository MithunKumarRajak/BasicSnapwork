"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Briefcase, User, Settings, Plus, MessageSquare, Shield } from "lucide-react"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    title: "My Jobs",
    href: "/dashboard/jobs",
    icon: <Briefcase className="mr-2 h-4 w-4" />,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: <MessageSquare className="mr-2 h-4 w-4" />,
  },
  {
    title: "Verification",
    href: "/dashboard/verification",
    icon: <Shield className="mr-2 h-4 w-4" />,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
]

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col space-y-4">
      <div className="mb-4">
        <Button asChild className="w-full">
          <Link href="/post-job">
            <Plus className="mr-2 h-4 w-4" /> Post a Job
          </Link>
        </Button>
      </div>
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              {item.icon}
              {item.title}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
