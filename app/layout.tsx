import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Snapwork - Find Help for Any Task",
  description: "Connect with skilled individuals for household tasks, tech help, labor work, and more.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen flex-col">
            <header className="border-b">
              <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold">Snapwork</span>
                  </Link>
                  <nav className="hidden md:flex gap-6">
                    <Link href="/services" className="text-sm font-medium hover:underline underline-offset-4">
                      Find Services
                    </Link>
                    <Link href="/become-provider" className="text-sm font-medium hover:underline underline-offset-4">
                      Become a Provider
                    </Link>
                    <Link href="/how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
                      How It Works
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-10">
              <div className="container flex flex-col gap-4 md:flex-row md:gap-8">
                <div className="flex-1 space-y-4">
                  <div className="text-xl font-bold">Snapwork</div>
                  <p className="text-sm text-muted-foreground">
                    Connect with skilled individuals for household tasks, tech help, labor work, and more.
                  </p>
                </div>
                <div className="flex flex-col gap-2 md:gap-4">
                  <div className="font-medium">Company</div>
                  <nav className="flex flex-col gap-2 text-sm">
                    <Link href="/about" className="hover:underline">
                      About
                    </Link>
                    <Link href="/careers" className="hover:underline">
                      Careers
                    </Link>
                    <Link href="/contact" className="hover:underline">
                      Contact
                    </Link>
                  </nav>
                </div>
                <div className="flex flex-col gap-2 md:gap-4">
                  <div className="font-medium">Legal</div>
                  <nav className="flex flex-col gap-2 text-sm">
                    <Link href="/privacy" className="hover:underline">
                      Privacy
                    </Link>
                    <Link href="/terms" className="hover:underline">
                      Terms
                    </Link>
                    <Link href="/cookies" className="hover:underline">
                      Cookies
                    </Link>
                  </nav>
                </div>
              </div>
              <div className="container mt-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Snapwork. All rights reserved.
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
