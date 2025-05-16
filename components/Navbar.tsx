"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X, Search, User, LogOut, Briefcase, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isLoading = status === "loading"

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <header className="border-b bg-white dark:bg-gray-950 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                SnapWork
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for jobs..." className="w-full pl-8" />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/jobs" className="text-sm font-medium hover:text-primary">
              Browse Jobs
            </Link>
            <Link href="/post-job" className="text-sm font-medium hover:text-primary">
              Post a Job
            </Link>

            <ThemeToggle />

            {isLoading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={session.user.name} />
                      <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/jobs">
                      <Briefcase className="mr-2 h-4 w-4" />
                      My Jobs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/post-job">
                      <Plus className="mr-2 h-4 w-4" />
                      Post a Job
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="button-gradient">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <div className="relative w-full mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for jobs..." className="w-full pl-8" />
            </div>
            <Link
              href="/jobs"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Jobs
            </Link>
            <Link
              href="/post-job"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Post a Job
            </Link>

            <div className="py-2">
              <ThemeToggle />
            </div>

            {isLoading ? (
              <div className="h-8 w-full animate-pulse rounded bg-muted"></div>
            ) : session ? (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center mb-4">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg" alt={session.user.name} />
                    <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/jobs" onClick={() => setIsMenuOpen(false)}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      My Jobs
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/post-job" onClick={() => setIsMenuOpen(false)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Post a Job
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" asChild>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
