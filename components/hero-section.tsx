import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-slate-100 to-slate-200">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Find Help for Any Daily Task
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Connect with skilled individuals for household tasks, tech help, labor work, and more across India. Get
                things done quickly and affordably.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="px-8">
                <Link href="/services">Find Services</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/become-provider">Become a Provider</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col space-y-4 rounded-xl border bg-white p-6 shadow-lg">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">What service do you need?</h2>
              <p className="text-sm text-gray-500">Search for services in your area</p>
            </div>
            <div className="flex items-center space-x-2">
              <Input placeholder="e.g. home cleaning, plumbing, electrician" className="flex-1" />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/services?category=household" className="text-sm text-primary hover:underline">
                  Cleaning
                </Link>
                <Link href="/services?category=tech-help" className="text-sm text-primary hover:underline">
                  Tech Support
                </Link>
                <Link href="/services?category=labor" className="text-sm text-primary hover:underline">
                  Plumbing
                </Link>
                <Link href="/services?category=gardening" className="text-sm text-primary hover:underline">
                  Gardening
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
