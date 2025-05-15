import { Card, CardContent } from "@/components/ui/card"
import { Search, FileText, CheckCircle } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">How SnapWork Works</h2>
          <p className="mt-2 text-muted-foreground">Simple steps to find daily work or hire workers</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Search className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-center text-xl font-bold">1. Search or Post</h3>
              <p className="text-center text-muted-foreground">
                Browse available jobs or post your requirements to find local workers for your tasks.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-center text-xl font-bold">2. Connect & Discuss</h3>
              <p className="text-center text-muted-foreground">
                Connect with workers or clients and discuss job details, timing, and payment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-center text-xl font-bold">3. Complete & Pay</h3>
              <p className="text-center text-muted-foreground">
                Get the job done and make secure payments through our platform or in person.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
