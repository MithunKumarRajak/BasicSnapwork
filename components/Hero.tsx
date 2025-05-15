import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Find Local Workers or Jobs in Minutes
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                SnapWork connects you with local talent for household tasks, repairs, deliveries and more across India.
                Get things done quickly and affordably.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="px-8">
                <Link href="/post-job">Post a Job</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/jobs">Find Work</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full max-w-[500px] rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 p-6 shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-4 text-center">
                  <h3 className="text-2xl font-bold">Get Started Today</h3>
                  <p className="text-muted-foreground">
                    Join thousands of people finding daily work and workers across India
                  </p>
                  <Button asChild>
                    <Link href="/register">Create an Account</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
